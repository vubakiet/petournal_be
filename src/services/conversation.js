import mongoose from "mongoose";
import Conversation from "../models/base/Conversation.js";
import Message from "../models/base/Message.js";
import ResponseModel from "../models/response/ResponseModel.js";
import User from "../models/base/User.js";

const ConversationService = {
    async createConversation(messageId) {
        const message = await Message.findById(messageId);
        if (!message) throw new ResponseModel(500, ["Không tồn tại tin nhắn"], null);

        const conversationSchema = new Conversation({
            _id: new mongoose.Types.ObjectId(),
            message,
            users: message.users,
        });

        const result = conversationSchema.save();

        return result;
    },

    async getConversations(user) {
        try {
            const userId = user._id.toString();

            const conversations = await Conversation.aggregate([
                {
                    $match: {
                        users: { $eq: userId },
                    },
                },
                {
                    $group: {
                        _id: {
                            $setUnion: ["$users", []], // Sort and make it a set
                        },
                        latestUpdatedAt: { $max: "$updatedAt" },
                        conversation: { $last: "$$ROOT" },
                    },
                },
                {
                    $sort: {
                        latestUpdatedAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: "Message",
                        localField: "conversation.message",
                        foreignField: "_id",
                        as: "conversation.message",
                    },
                },
                {
                    $project: {
                        _id: "$conversation._id",
                        message: "$conversation.message",
                        users: "$conversation.users",
                        createdAt: "$conversation.createdAt",
                        updatedAt: "$conversation.updatedAt",
                    },
                },
            ]);

            const conversationsWithUsers = await Promise.all(
                conversations.map(async (conversation) => {
                    const currentUserIndex = conversation.users.indexOf(userId);
                    const otherUserIndex = currentUserIndex === 0 ? 1 : 0;
                    const otherUserId = conversation.users[otherUserIndex];

                    const partner = await this.getUserById(otherUserId);

                    return {
                        _id: conversation._id,
                        message: conversation.message,
                        users: conversation.users,
                        userPartner: partner,
                        selfChat: userId,
                        createdAt: conversation.createdAt,
                        updatedAt: conversation.updatedAt,
                    };
                })
            );

            return conversationsWithUsers;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getUserById(userId) {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

export default ConversationService;
