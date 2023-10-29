import { Router } from "express";
import ConversationController from "../controllers/conversation.js";

const route = Router();

route.post("/addMessage", ConversationController.addMessage);
route.post("/getMessages", ConversationController.getMessages);

export default route;