import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['EVENT_ANNOUNCEMENT', 'NEW_MESSAGE'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: String, // Can be eventId or messageId
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '3d' // Automatically delete after 3 days (3 days = 259200 seconds, but mongoose expires takes string like '3d' or seconds)
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
