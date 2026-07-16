import { axiosInstance } from './axiosInstance';

export const messageAPI = {
    getConversations: async () => {
        const response = await axiosInstance.get('/messages/conversations');
        return response.data;
    },
    
    getMessages: async (conversationId) => {
        const response = await axiosInstance.get(`/messages/${conversationId}`);
        return response.data;
    },
    
    sendMessage: async (receiverId, text) => {
        const response = await axiosInstance.post('/messages', { receiverId, text });
        return response.data;
    },
    
    searchUsers: async (query) => {
        const response = await axiosInstance.get(`/messages/users/search?query=${query}`);
        return response.data;
    },
    
    getUnreadCount: async () => {
        const response = await axiosInstance.get('/messages/unread-count');
        return response.data;
    },
    
    markAsRead: async (conversationId) => {
        const response = await axiosInstance.put(`/messages/${conversationId}/read`);
        return response.data;
    }
};
