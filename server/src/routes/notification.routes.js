import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    getNotifications, 
    markAsRead, 
    markAllAsRead, 
    triggerTestNotification 
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.post("/test-trigger", triggerTestNotification);

export default router;
