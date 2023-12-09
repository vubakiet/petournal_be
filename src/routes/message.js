import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import MessageController from "../controllers/message.js";

const route = Router();

route.post("/addMessage", AuthMiddleware.verifyToken, MessageController.addMessage);
route.post("/getMessages", AuthMiddleware.verifyToken, MessageController.getMessages);

export default route;