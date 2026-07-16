import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    getConversations, 
    getMessages, 
    sendMessage,
    searchUsers,
    getUnreadCount,
    markConversationAsRead
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/conversations", getConversations);
router.get("/users/search", searchUsers);
router.get("/unread-count", getUnreadCount);
router.put("/:conversationId/read", markConversationAsRead);
router.get("/:conversationId", getMessages);
router.post("/", sendMessage);

export default router;
