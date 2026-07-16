import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { fadeUp } from '../../hooks/useAnimations';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Search, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../../api/messageAPI';
import NewMessageModal from '../../components/ui/NewMessageModal';

export default function MessagesPage() {
    const { user } = useAuth();
    const { socket, setUnreadMessageCount } = useNotification();
    
    const [conversations, setConversations] = useState([]);
    const [activeConvoId, setActiveConvoId] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [search, setSearch] = useState('');
    const [newMsg, setNewMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const messagesEndRef = useRef(null);

    // Fetch initial conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await messageAPI.getConversations();
                if (res.success) {
                    // Only set conversations that are NOT temp ones, or merge them.
                    // Actually, just set them. But if we are currently holding a temp convo, preserve it.
                    setConversations(prev => {
                        const tempConvos = prev.filter(c => c._id && String(c._id).startsWith('new_'));
                        return [...tempConvos, ...res.conversations];
                    });
                    
                    // Set active convo only on initial load if not already set
                    setConversations(prev => {
                        if (prev.length > 0) {
                            setActiveConvoId(currentId => currentId ? currentId : prev[0]._id);
                        }
                        return prev;
                    });
                }
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            }
        };
        fetchConversations();
    }, []); // Run only on mount

    // Fetch messages for active conversation
    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeConvoId || String(activeConvoId).startsWith('new_')) {
                setChatMessages([]);
                return;
            }
            try {
                const res = await messageAPI.getMessages(activeConvoId);
                if (res.success) {
                    setChatMessages(res.messages);
                    scrollToBottom();
                    
                    // Mark as read when opened
                    await messageAPI.markAsRead(activeConvoId);
                    
                    // Refresh the global unread count so the badge updates instantly
                    const countRes = await messageAPI.getUnreadCount();
                    if (countRes.success) {
                        setUnreadMessageCount(countRes.count);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMessages();
    }, [activeConvoId]);

    // Setup socket listener
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            // If the message belongs to the currently active conversation, append it
            if (message.conversationId === activeConvoId) {
                setChatMessages(prev => [...prev, message]);
                scrollToBottom();
            }

            // Update conversation list's last message and sort
            setConversations(prev => {
                const convoIndex = prev.findIndex(c => c._id === message.conversationId);
                let updatedConvos = [...prev];
                
                if (convoIndex > -1) {
                    // Update existing
                    const convo = updatedConvos[convoIndex];
                    convo.lastMessage = message;
                    convo.updatedAt = message.createdAt;
                    updatedConvos.splice(convoIndex, 1);
                    updatedConvos.unshift(convo);
                } else {
                    // We should ideally fetch the conversation details if it's new,
                    // but for now, we'll refetch all conversations to get the populated data.
                    messageAPI.getConversations().then(res => {
                        if (res.success) setConversations(res.conversations);
                    });
                }
                return updatedConvos;
            });
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, activeConvoId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMsg.trim()) return;

        const text = newMsg.trim();
        setNewMsg(''); // Optimistic clear

        const activeConvo = conversations.find(c => c._id === activeConvoId);
        if (!activeConvo) return;

        // Find the receiver ID
        const receiver = activeConvo.participants.find(p => p._id !== user._id);
        if (!receiver) return;

        try {
            const res = await messageAPI.sendMessage(receiver._id, text);
            if (res.success) {
                const msg = res.message;
                
                // If it was a new conversation, update the ID
                if (activeConvoId.startsWith('new_')) {
                    const realConvoId = msg.conversationId;
                    setActiveConvoId(realConvoId);
                    
                    // Refresh conversations to get proper DB object
                    const convoRes = await messageAPI.getConversations();
                    if (convoRes.success) {
                        setConversations(convoRes.conversations);
                    }
                } else {
                    // Append message
                    setChatMessages(prev => [...prev, msg]);
                    scrollToBottom();
                    
                    // Update conversations list
                    setConversations(prev => {
                        const updated = [...prev];
                        const idx = updated.findIndex(c => c._id === activeConvoId);
                        if (idx > -1) {
                            updated[idx].lastMessage = msg;
                            updated[idx].updatedAt = msg.createdAt;
                            const [moved] = updated.splice(idx, 1);
                            updated.unshift(moved);
                        }
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.error("Failed to send message", error);
            setNewMsg(text); // Restore text on failure
        }
    };

    const handleSelectNewUser = (selectedUser) => {
        setIsModalOpen(false);
        // Check if conversation already exists
        const existing = conversations.find(c => 
            c.participants.some(p => p._id === selectedUser._id)
        );

        if (existing) {
            setActiveConvoId(existing._id);
        } else {
            // Create a temporary conversation
            const tempId = 'new_' + selectedUser._id;
            const tempConvo = {
                _id: tempId,
                participants: [user, selectedUser],
                lastMessage: null,
                updatedAt: new Date().toISOString(),
                isNew: true
            };
            setConversations(prev => [tempConvo, ...prev]);
            setActiveConvoId(tempId);
        }
    };

    const filtered = conversations.filter(c => {
        const otherParticipant = c.participants.find(p => p._id !== user._id);
        return otherParticipant?.name.toLowerCase().includes(search.toLowerCase());
    });

    const activeConvo = conversations.find(c => c._id === activeConvoId);
    const activeReceiver = activeConvo?.participants.find(p => p._id !== user._id);

    return (
        <div className="messages-page">
            <NewMessageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSelectUser={handleSelectNewUser}
            />

            {/* Conversation List */}
            <motion.div className="messages__sidebar" {...fadeUp(0)}>
                <div className="messages__sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2><MessageCircle size={20} /> Messages</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        style={{ 
                            background: 'var(--accent)', color: '#fff', border: 'none', 
                            padding: '6px', borderRadius: '50%', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="New Message"
                    >
                        <Plus size={18} />
                    </button>
                </div>
                <div className="messages__search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="messages__list">
                    {filtered.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0', fontSize: '14px' }}>
                            No conversations found.
                        </p>
                    ) : (
                        filtered.map((convo, i) => {
                            const other = convo.participants.find(p => p._id !== user._id);
                            const lastMsg = convo.lastMessage;
                            
                            return (
                                <motion.div
                                    key={convo._id}
                                    className={`message-convo ${activeConvoId === convo._id ? 'message-convo--active' : ''}`}
                                    onClick={() => setActiveConvoId(convo._id)}
                                    {...fadeUp(i + 1)}
                                    whileHover={{ x: 4 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                >
                                    <div className="message-convo__avatar">
                                        {other?.avatar ? <img src={other.avatar} alt="" /> : (other?.name?.charAt(0) || '?')}
                                    </div>
                                    <div className="message-convo__info">
                                        <div className="message-convo__top">
                                            <span className="message-convo__name">{other?.name || 'Unknown User'}</span>
                                            <span className="message-convo__time">
                                                {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'New'}
                                            </span>
                                        </div>
                                        <div className="message-convo__bottom">
                                            <span className="message-convo__preview">
                                                {lastMsg ? lastMsg.text : 'Start a new conversation...'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div className="messages__chat" {...fadeUp(1)}>
                {activeConvo ? (
                    <>
                        <div className="messages__chat-header">
                            <div className="messages__chat-avatar">
                                {activeReceiver?.avatar ? <img src={activeReceiver.avatar} alt="" /> : (activeReceiver?.name?.charAt(0) || '?')}
                            </div>
                            <div>
                                <span className="messages__chat-name">{activeReceiver?.name || 'Unknown'}</span>
                                <span className="messages__chat-role" style={{ textTransform: 'capitalize' }}>{activeReceiver?.role || 'User'}</span>
                            </div>
                        </div>

                        <div className="messages__chat-body">
                            {chatMessages.length === 0 ? (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                    <p>Say hello to {activeReceiver?.name}!</p>
                                </div>
                            ) : (
                                chatMessages.map(msg => {
                                    const isMe = msg.sender._id === user._id || msg.sender === user._id; // Depending on populate
                                    return (
                                        <div
                                            key={msg._id}
                                            className={`chat-bubble ${isMe ? 'chat-bubble--me' : 'chat-bubble--them'}`}
                                        >
                                            <p>{msg.text}</p>
                                            <span className="chat-bubble__time">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="messages__chat-input" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMsg}
                                onChange={e => setNewMsg(e.target.value)}
                            />
                            <button type="submit" className="messages__send-btn" disabled={!newMsg.trim()}>
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="messages__empty">
                        <MessageCircle size={48} />
                        <p>Select a conversation to start chatting</p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                marginTop: '16px', background: 'var(--accent)', color: '#fff',
                                border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer'
                            }}
                        >
                            Start a New Conversation
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
