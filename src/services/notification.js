import Notification from "../models/base/Notification.js";
import { NOTIFICATION } from "../common/constant/notification.js";
import mongoose from "mongoose";
import Follower from "../models/base/Follower.js";

const NotificationService = {
    async createNotification(user, notificationBody) {
        try {
            const follower = await Follower.find({
                user: user
            })

            let query;
            if(notificationBody.type == NOTIFICATION.FOLLOW){
                query = {
                    _id: new mongoose.Types.ObjectId(),
                    type: notificationBody.type,
                    userReceive: user
                }

            }

            const notificationSchema = new Notification({
                
            })
        } catch (error) {
            console.log(error);
        }
    },
};

export default NotificationService;
