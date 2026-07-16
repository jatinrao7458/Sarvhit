import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true
        },
        readBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
