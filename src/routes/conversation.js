import { Router } from "express";
import ConversationController from "../controllers/conversation.js";
import { AuthMiddleware } from "../middlewares/auth.js";

const route = Router();

route.post("/getConversations", AuthMiddleware.verifyToken, ConversationController.getConversations);

export default route;