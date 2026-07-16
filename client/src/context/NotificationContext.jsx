import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../api/axiosInstance';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/notifications');
            if (res.data.success) {
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, []);

    const fetchUnreadMessageCount = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/messages/unread-count');
            if (res.data.success) {
                setUnreadMessageCount(res.data.count);
            }
        } catch (error) {
            console.error("Failed to fetch unread message count:", error);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchNotifications();
            fetchUnreadMessageCount();

            // Initialize socket connection
            const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000', {
                withCredentials: true,
                transports: ['websocket', 'polling']
            });

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
            });

            newSocket.on("new_notification", (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });

            newSocket.on("receive_message", () => {
                fetchUnreadMessageCount();
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            setNotifications([]);
            setUnreadCount(0);
            setUnreadMessageCount(0);
        }
    }, [isAuthenticated, user, fetchNotifications, fetchUnreadMessageCount]);

    const markAsRead = async (notificationId) => {
        try {
            await axiosInstance.put(`/notifications/${notificationId}/read`);
            setNotifications(prev => prev.map(n => 
                n._id === notificationId ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosInstance.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const triggerTestNotification = async (message, type) => {
        try {
            await axiosInstance.post('/notifications/test-trigger', { message, type });
        } catch (error) {
            console.error("Failed to trigger test notification:", error);
        }
    };

    const decrementUnreadMessageCount = (amount = 1) => {
        setUnreadMessageCount(prev => Math.max(0, prev - amount));
    };

    return (
        <NotificationContext.Provider value={{
            socket,
            notifications,
            unreadCount,
            unreadMessageCount,
            setUnreadMessageCount,
            decrementUnreadMessageCount,
            markAsRead,
            markAllAsRead,
            triggerTestNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
}

export default NotificationContext;
