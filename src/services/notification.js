import Notification from "../models/base/Notification.js";
import { NOTIFICATION } from "../common/constant/notification.js";
import mongoose from "mongoose";
import Post from "../models/base/Post.js";
import Comment from "../models/base/Comment.js";
import Following from "../models/base/Following.js";

const NotificationService = {
    async createNotification(user, notificationBody) {
        try {
            let query;
            if (notificationBody.type === NOTIFICATION.FOLLOW) {
                const following = await Following.findOne({
                    user: user,
                    following: notificationBody.follow_id,
                });

                console.log(following);

                query = {
                    _id: new mongoose.Types.ObjectId(),
                    type: notificationBody.type,
                    userSend: user,
                    userReceive: following,
                    text: `${user.firstName} đã follow bạn`,
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
                    text: `${user.firstName} đã thích bài viết của bạn`,
                };
            }

            if (notificationBody.type === NOTIFICATION.COMMENT) {
                const post = await Post.findById(notificationBody.post_id);

                console.log(notificationBody);

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
                        text: `${user.firstName} đã bình luận bài viết của bạn`,
                    };
                }
            }
            if (notificationBody.type == NOTIFICATION.REPLY_COMMENT) {
                const comment = await Comment.findById({ _id: notificationBody.comment_id });

                console.log(comment);
                if(comment._id.toString() !== comment.parent_id.toString()){
                    query = {
                        _id: new mongoose.Types.ObjectId(),
                        type: notificationBody.type,
                        userSend: user,
                        userReceive: comment.user,
                        comment: comment,
                        text: `${user.firstName} đã trả lời bình luận của bạn`,
                    };
                }
            }

            console.log(query);

            const notificationSchema = new Notification(query);

            const result = await notificationSchema.save();
            return result;
        } catch (error) {
            console.log(error);
        }
    },
};

export default NotificationService;
