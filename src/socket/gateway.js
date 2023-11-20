import mongoose from "mongoose";
import Connection from "../models/base/Connection.js";
import Notification from "../models/base/Notification.js";
import jwt from "jsonwebtoken";
import { SECRECT_KEY } from "../config/index.js";
import ResponseModel from "../models/response/ResponseModel.js";
import { NOTIFICATION } from "../common/constant/notification.js";
import Post from "../models/base/Post.js";
import NotificationService from "../services/notification.js";

const Gateway = {
    async connection(socket) {
        console.log(`User connected is: ${socket.id}`);

        const token = socket.handshake.headers.authorization;

        const user = await Gateway.getUserByAccessToken(token);
        const existConnection = await Connection.findOne({
            user: user,
        });

        if (!existConnection) {
            const connectionSchema = new Connection({
                _id: new mongoose.Types.ObjectId(),
                user: user,
                socket_id: socket.id,
            });
            await connectionSchema.save();
        } else {
            await Connection.findByIdAndUpdate(
                existConnection._id,
                {
                    $set: { socket_id: socket.id },
                },
                { new: true }
            );
        }

        socket.on("disconnect", async () => {
            console.log(`User disconnect id is ${socket.id}`);
            await Connection.findOneAndDelete({
                socket_id: socket.id,
            });
        });

        socket.on("newMessage", (msg) => {
            console.log(`msg is: ${msg}`);
            _io.emit("receiveMessage", msg);
        });

        socket.on("like-post-notification", async (notificationBody) => {

            const resConnection = await Connection.findOne({
                socket_id: socket.id,
            }).populate('user');
            const userLogin = resConnection.user;

            const result = await NotificationService.createNotification(userLogin, notificationBody);

            if (result) {
                const post = await Post.findById(notificationBody.post_id);
                const receiverConnection = await Connection.findOne({
                    user: post.user,
                });

                if (receiverConnection) {
                    _io.to(receiverConnection.socket_id).emit("listen-like-post-notification", result);
                }
            }
        });
    },

    async getUserByAccessToken(token) {
        try {
            const objectGenarate = jwt.verify(token, SECRECT_KEY);
            return objectGenarate.user;
        } catch (error) {
            console.error("JWT decoding error:", error.message);
            return null;
        }
    },
};

export default Gateway;
