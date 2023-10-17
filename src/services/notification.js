import Notification from "../models/base/Notification.js";
import { NOTIFICATION } from "../common/constant/notification.js";
import mongoose from "mongoose";
import Follower from "../models/base/Follower.js";

const NotificationService = {
    async createNotification(user, notificationBody) {
        try {
            let query;
            if(notificationBody.type == NOTIFICATION.FOLLOW){
                const follower = await Follower.findOne({
                    user: user,
                    follower: notificationBody.follow_id
                })

                query = {
                    _id: new mongoose.Types.ObjectId(),
                    type: notificationBody.type,
                    userSend: user,
                    userReceive: follower,
                    text: `${}`
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
