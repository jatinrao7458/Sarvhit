import Notification from "../models/Notification.model.js";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitNotification } from "../socket.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Get user's notifications
// @route   GET /api/v1/notifications
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50); // Get latest 50

    res.status(200).json({ success: true, notifications });
});

// @desc    Mark a notification as read
// @route   PUT /api/v1/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    res.status(200).json({ success: true, notification });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
export const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    );

    res.status(200).json({ success: true });
});

// @desc    MOCK: Trigger an event notification to all users (for testing)
// @route   POST /api/v1/notifications/test-trigger
export const triggerTestNotification = asyncHandler(async (req, res) => {
    const { message, type } = req.body;
    
    // Find all users except the sender
    const users = await User.find({ _id: { $ne: req.user._id } });

    const notificationsToCreate = users.map(user => ({
        recipient: user._id,
        type: type || 'EVENT_ANNOUNCEMENT',
        content: message || `${req.user.name} has organized a new event!`,
        relatedId: "mock_event_123"
    }));

    if (notificationsToCreate.length > 0) {
        const createdNotifications = await Notification.insertMany(notificationsToCreate);
        
        // Emit via socket to online users
        createdNotifications.forEach(notification => {
            emitNotification(notification.recipient, notification);
        });
    }

    res.status(200).json({ 
        success: true, 
        message: `Notification sent to ${users.length} users.` 
    });
});
