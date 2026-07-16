import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, MessageSquare, Calendar } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, triggerTestNotification } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        
        // Navigation based on notification type
        if (notification.type === 'NEW_MESSAGE') {
            navigate('/app/messages');
        } else if (notification.type === 'EVENT_ANNOUNCEMENT') {
            navigate('/app/events'); // Or specific event detail if we had real relatedId
        }
        
        setIsOpen(false);
    };

    return (
        <div className="notification-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
            <button 
                className="notification-trigger"
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    background: 'transparent', border: 'none', cursor: 'pointer', 
                    padding: '8px', position: 'relative', color: 'var(--text-secondary)'
                }}
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="notification-badge"
                        style={{
                            position: 'absolute', top: '4px', right: '4px',
                            background: 'red', color: 'white', fontSize: '10px',
                            fontWeight: 'bold', width: '16px', height: '16px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center'
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="notification-dropdown glass"
                        style={{
                            position: 'absolute', top: '100%', right: '0',
                            width: '320px', borderRadius: '12px', padding: '16px',
                            zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            maxHeight: '400px', overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    style={{ 
                                        background: 'none', border: 'none', cursor: 'pointer', 
                                        color: 'var(--accent)', fontSize: '12px', display: 'flex', 
                                        alignItems: 'center', gap: '4px' 
                                    }}
                                >
                                    <Check size={14} /> Mark all read
                                </button>
                            )}
                        </div>

                        {notifications.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                                <Bell size={32} style={{ opacity: 0.2, margin: '0 auto 8px' }} />
                                <p style={{ fontSize: '14px', margin: 0 }}>No notifications yet</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {notifications.map(notification => (
                                    <div 
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        style={{
                                            padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                            background: notification.isRead ? 'transparent' : 'var(--bg-card)',
                                            border: '1px solid',
                                            borderColor: notification.isRead ? 'transparent' : 'var(--border-color)',
                                            display: 'flex', gap: '12px', alignItems: 'flex-start',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ 
                                            padding: '8px', borderRadius: '50%', 
                                            background: notification.type === 'NEW_MESSAGE' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: notification.type === 'NEW_MESSAGE' ? '#3b82f6' : '#10b981'
                                        }}>
                                            {notification.type === 'NEW_MESSAGE' ? <MessageSquare size={16} /> : <Calendar size={16} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                                                {notification.content}
                                            </p>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {!notification.isRead && (
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginTop: '8px' }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Testing button for development */}
                        <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', textAlign: 'center' }}>
                            <button 
                                onClick={() => triggerTestNotification("Someone just joined your NGO Event!", "EVENT_ANNOUNCEMENT")}
                                style={{ 
                                    background: 'var(--bg-card)', border: '1px solid var(--border-color)', 
                                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                Simulate Event Notification
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
