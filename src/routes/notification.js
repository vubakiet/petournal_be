import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import NotificationController from "../controllers/notification.js";

const route = express.Router();

route.post("/createNotification", AuthMiddleware.verifyToken, NotificationController.createNotification);

route.post("/isUserNotificationExist", AuthMiddleware.verifyToken, NotificationController.isUserNotificationExist);

route.post("/getUserNotification", AuthMiddleware.verifyToken, NotificationController.getUserNotification);

route.post("/updateIsRead", AuthMiddleware.verifyToken, NotificationController.updateIsRead);

export default route;
