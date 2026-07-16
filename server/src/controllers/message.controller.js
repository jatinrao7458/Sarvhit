import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";
import Notification from "../models/Notification.model.js";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitNotification, getIo, getUserSocketId } from "../socket.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Get all conversations for the logged in user
// @route   GET /api/v1/messages/conversations
export const getConversations = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const conversations = await Conversation.find({
        participants: { $in: [userId] }
    })
    .populate("participants", "name email role avatar")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, conversations });
});

// @desc    Get messages for a specific conversation
// @route   GET /api/v1/messages/:conversationId
export const getMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    
    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }
    
    if (!conversation.participants.includes(req.user._id)) {
        throw new ApiError(403, "Not authorized to view this conversation");
    }

    const messages = await Message.find({ conversationId })
        .populate("sender", "name avatar")
        .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
});

// @desc    Send a message
// @route   POST /api/v1/messages
export const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    if (!text) {
        throw new ApiError(400, "Message text is required");
    }

    // Find if conversation exists
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
        // Create new conversation
        conversation = await Conversation.create({
            participants: [senderId, receiverId]
        });
    }

    // Create message
    const message = await Message.create({
        conversationId: conversation._id,
        sender: senderId,
        text,
        readBy: [senderId]
    });

    // Update conversation lastMessage
    conversation.lastMessage = message._id;
    await conversation.save();

    // Populate sender details for real-time emission
    await message.populate("sender", "name avatar");

    // Real-time Socket Emits
    const io = getIo();
    const receiverSocketId = getUserSocketId(receiverId);

    if (receiverSocketId) {
        // Emit message if online
        io.to(receiverSocketId).emit("receive_message", message);
    } else {
        // Create Notification if not online (or you can create it anyway if they aren't on the messages page)
        const notification = await Notification.create({
            recipient: receiverId,
            type: 'NEW_MESSAGE',
            content: `New message from ${req.user.name}`,
            relatedId: conversation._id.toString()
        });
        
        // Actually, emit the notification event so their notification badge updates if they are online but not in the chat
        if (receiverSocketId) {
             emitNotification(receiverId, notification);
        }
    }
    
    // Always create a notification so it shows up in their dropdown
    const notification = await Notification.create({
        recipient: receiverId,
        type: 'NEW_MESSAGE',
        content: `New message from ${req.user.name}`,
        relatedId: conversation._id.toString()
    });
    emitNotification(receiverId, notification);

    res.status(201).json({ success: true, message });
});

// @desc    Search users to start a new conversation
// @route   GET /api/v1/messages/users/search
export const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(200).json({ success: true, users: [] });
    }

    const users = await User.find({
        _id: { $ne: req.user._id },
        name: { $regex: query, $options: "i" }
    })
    .select("name email role avatar")
    .limit(10);

    res.status(200).json({ success: true, users });
});

// @desc    Get unread messages count
// @route   GET /api/v1/messages/unread-count
export const getUnreadCount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const conversations = await Conversation.find({ participants: userId });
    const conversationIds = conversations.map(c => c._id);

    const unreadCount = await Message.countDocuments({
        conversationId: { $in: conversationIds },
        readBy: { $ne: userId }
    });

    res.status(200).json({ success: true, count: unreadCount });
});

// @desc    Mark messages in a conversation as read
// @route   PUT /api/v1/messages/:conversationId/read
export const markConversationAsRead = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
        { conversationId, readBy: { $ne: userId } },
        { $push: { readBy: userId } }
    );

    res.status(200).json({ success: true });
});
