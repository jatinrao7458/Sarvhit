import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User } from 'lucide-react';
import { messageAPI } from '../../api/messageAPI';

export default function NewMessageModal({ isOpen, onClose, onSelectUser }) {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setUsers([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                try {
                    const res = await messageAPI.searchUsers(query);
                    if (res.success) {
                        setUsers(res.users);
                    }
                } catch (error) {
                    console.error("Failed to search users", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUsers([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <motion.div 
                className="modal-content glass"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '90%', maxWidth: '400px', padding: '24px',
                    borderRadius: '16px', position: 'relative',
                    background: 'var(--bg-card)'
                }}
            >
                <button onClick={onClose} style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)'
                }}>
                    <X size={20} />
                </button>

                <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>New Message</h3>
                
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(0,0,0,0.05)', padding: '8px 12px',
                    borderRadius: '8px', marginBottom: '16px',
                    border: '1px solid var(--border-color)'
                }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input 
                        type="text" 
                        placeholder="Search users by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            border: 'none', background: 'transparent',
                            outline: 'none', width: '100%', color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {isLoading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Searching...</p>
                    ) : users.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {users.map(user => (
                                <div 
                                    key={user._id}
                                    onClick={() => onSelectUser(user)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                        transition: 'background 0.2s', border: '1px solid transparent'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: 'var(--accent-soft)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--accent)', fontWeight: 'bold'
                                    }}>
                                        {user.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-primary)' }}>{user.name}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query.length > 1 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No users found.</p>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Type to search users</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
