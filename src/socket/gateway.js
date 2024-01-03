import mongoose from "mongoose";
import Connection from "../models/base/Connection.js";
import Notification from "../models/base/Notification.js";
import jwt from "jsonwebtoken";
import { SECRECT_KEY } from "../config/index.js";
import ResponseModel from "../models/response/ResponseModel.js";
import { NOTIFICATION } from "../common/constant/notification.js";
import Post from "../models/base/Post.js";
import NotificationService from "../services/notification.js";
import ConversationService from "../services/conversation.js";
import MessageService from "../services/message.js";
import Comment from "../models/base/Comment.js";
import Conversation from "../models/base/Conversation.js";

const Gateway = {
    async connection(socket) {
        console.log(`User connected is: ${socket.id}`);

        const token = socket.handshake.headers.authorization;

        const user = await Gateway.getUserByAccessToken(token);
        console.log(user);
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

        // LIKE_POST

        socket.on("like-post-notification", async (notificationBody) => {
            const resConnection = await Connection.findOne({
                socket_id: socket.id,
            }).populate("user");
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
        socket.on("like-post-action", async (body) => {
            const post = await Post.findById(body.post_id);
            _io.emit("listen-like-post-action", post);
        });

        // COMMENT

        socket.on("comment-post-notification", async (notificationBody) => {
            const resConnection = await Connection.findOne({
                socket_id: socket.id,
            }).populate("user");
            const userLogin = resConnection.user;

            const result = await NotificationService.createNotification(userLogin, notificationBody);

            if (result) {
                const post = await Post.findById(notificationBody.post_id);
                const receiverConnection = await Connection.findOne({
                    user: post.user,
                });

                if (receiverConnection) {
                    _io.to(receiverConnection.socket_id).emit("listen-comment-post-notification", result);
                }
            }
        });
        socket.on("comment-post-action", async (body) => {
            const { comment_id } = body;
            const comment = await Comment.findById(comment_id).populate("user");
            if (comment) {
                _io.emit("listen-comment-post-action", comment);
            }
        });
        socket.on("comment-child-post-action", async (body) => {
            const { comment_id } = body;
            const comment = await Comment.findById(comment_id).populate("user");
            if (comment) {
                _io.emit("listen-comment-child-post-action", comment);
            }
        });
        socket.on("delete-comment-action", async (body) => {
            _io.emit("listen-delete-comment-action", body);
        });

        socket.on("send-message", async (messageBody) => {
            const receiverConnection = await Connection.findOne({
                user: messageBody.userId,
            });

            if (receiverConnection) {
                _io.to(receiverConnection.socket_id).emit("listen-receive-message", messageBody.data);
            }
        });

        // FOLLOW

        socket.on("follow-notification", async (notificationBody) => {
            const resConnection = await Connection.findOne({
                socket_id: socket.id,
            }).populate("user");
            const userLogin = resConnection.user;

            const result = await NotificationService.createNotification(userLogin, notificationBody);
            if (result) {
                const receiverConnection = await Connection.findOne({
                    user: result.userReceive,
                });
                if (receiverConnection) {
                    _io.to(receiverConnection.socket_id).emit("listen-follow-notification", result);
                }
            }
        });

        // LIKE PET

        socket.on("like-pet-notification", async (notificationBody) => {
            const resConnection = await Connection.findOne({
                socket_id: socket.id,
            }).populate("user");
            const userLogin = resConnection.user;

            const result = await NotificationService.createNotification(userLogin, notificationBody);
            if (result) {
                const receiverConnection = await Connection.findOne({
                    user: result.userReceive,
                });
                if (receiverConnection) {
                    _io.to(receiverConnection.socket_id).emit("listen-like-pet-notification", result);
                }
            }
        });

        // countChatNoti
        socket.on("chat-notification", async (conversationId) => {
            const conversation = await Conversation.findById(conversationId);
            if (conversation) {
                const receiverConnection = await Connection.findOne({
                    user: conversation.userReceive,
                });
                if (receiverConnection) {
                    _io.to(receiverConnection.socket_id).emit("listen-chat-notification");
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
