import Notification from "../models/base/Notification.js";
import { NOTIFICATION } from "../common/constant/notification.js";
import mongoose from "mongoose";
import Post from "../models/base/Post.js";
import Comment from "../models/base/Comment.js";
import Following from "../models/base/Following.js";
import Pet from "../models/base/Pet.js";

const NotificationService = {
    async getUserNotification(user, body) {
        const page = body.page || 1;
        const limit = body.limit || 6;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ userReceive: user })
            .skip(skip)
            .limit(limit)
            .populate("userSend", "firstName lastName avatar")
            .sort({ createdAt: -1 });

        const totalNotifications = await Notification.countDocuments({ userReceive: user, isRead: false });

        return { notifications, totalNotifications };
    },

    async updateIsRead(user, body) {
        await Notification.updateOne({ userReceive: user, _id: body.notification_id }, { isRead: true });
        return true;
    },

    async createNotification(user, notificationBody) {
        try {
            let query;
            if (notificationBody.type === NOTIFICATION.FOLLOW) {
                const following = await Following.findOne({
                    user: user,
                    following: notificationBody.follow_id,
                });

                query = {
                    _id: new mongoose.Types.ObjectId(),
                    type: notificationBody.type,
                    userSend: user,
                    userReceive: following.following._id.toString(),
                    text: `đã theo dõi bạn`,
                };
            }

            if (notificationBody.type === NOTIFICATION.LIKE_POST) {
                const post = await Post.findById(notificationBody.post_id);

                query = {
                    _id: new mongoose.Types.ObjectId(),
                    type: notificationBody.type,
                    userSend: user,
                    userReceive: post.user,
                    post: post,
                    text: `đã thích bài viết của bạn`,
                };
            }

            if (notificationBody.type === NOTIFICATION.COMMENT) {
                const post = await Post.findById(notificationBody.post_id);

                const comment = await Comment.findOne({
                    _id: notificationBody.comment_id,
                    post: post,
                });

                if (comment) {
                    query = {
                        _id: new mongoose.Types.ObjectId(),
                        type: notificationBody.type,
                        userSend: user,
                        userReceive: post.user,
                        post: post,
                        comment: comment,
                        text: `đã bình luận bài viết của bạn`,
                    };
                }
            }
            if (notificationBody.type == NOTIFICATION.REPLY_COMMENT) {
                const comment = await Comment.findById({ _id: notificationBody.comment_id });

                if (comment._id.toString() !== comment.parent_id.toString()) {
                    query = {
                        _id: new mongoose.Types.ObjectId(),
                        type: notificationBody.type,
                        userSend: user,
                        userReceive: comment.user,
                        comment: comment,
                        text: `đã trả lời bình luận của bạn`,
                    };
                }
            }
            if (notificationBody.type == NOTIFICATION.LIKE_PET) {
                const pet = await Pet.findById(notificationBody.pet_id);

                query = {
                    _id: new mongoose.Types.ObjectId(),
                    type: notificationBody.type,
                    userSend: user,
                    userReceive: pet.user,
                    text: `đã thích ${pet.name} của bạn`,
                    pet: pet,
                };
            }

            const notificationSchema = new Notification(query);

            const result = await notificationSchema.save();
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async isUserNotificationExist(user, body) {
        const { type, post_id } = body;

        if (type === NOTIFICATION.LIKE_POST) {
            const post = await Post.findById(post_id);
            const isExist = await Notification.findOne({
                type: NOTIFICATION.LIKE_POST,
                userSend: user,
                post: post,
            });
            return isExist;
        }
        if (type === NOTIFICATION.COMMENT) {
            const post = await Post.findById(post_id);
            const isExist = await Notification.findOne({
                type: NOTIFICATION.COMMENT,
                userSend: user,
                post: post,
            });
            return isExist;
        }
        if (type === NOTIFICATION.REPLY_COMMENT) {
            const comment = await Comment.findById(body.comment_id);
            const isExist = await Notification.findOne({
                type: NOTIFICATION.REPLY_COMMENT,
                userSend: user,
                comment: comment,
            });
            return isExist;
        }
        if (type === NOTIFICATION.FOLLOW) {
            const following = await Following.findOne({
                user: user,
                following: body.follow_id,
            });
            const isExist = await Notification.findOne({
                type: NOTIFICATION.FOLLOW,
                userSend: user,
                userReceive: following.following._id.toString(),
            });
            return isExist;
        }
        if (type === NOTIFICATION.LIKE_PET) {
            const pet = await Pet.findById(body.pet_id);
            const isExist = await Notification.findOne({
                type: NOTIFICATION.LIKE_PET,
                userSend: user,
                userReceive: pet.user,
                pet: pet,
            });
            return isExist;
        }
    },
};

export default NotificationService;
