import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import NotificationController from "../controllers/notification.js";


const route = express.Router();

route.post("/createNotification", AuthMiddleware.verifyToken, NotificationController.createNotification);

export default route;