import mongoose from "mongoose";
import Conversation from "../models/base/Conversation.js";
import Message from "../models/base/Message.js";
import ResponseModel from "../models/response/ResponseModel.js";
import User from "../models/base/User.js";

const ConversationService = {
    async createConversation(body) {
        const message = await Message.findById(body.messageId);
        if (!message) throw new ResponseModel(500, ["Không tồn tại tin nhắn"], null);

        const isConversationExist = await Conversation.findOne({
            users: { $all: message.users },
        });
        console.log(isConversationExist);
        if (isConversationExist) {
            const updateConversation = await Conversation.findOneAndUpdate(
                { _id: isConversationExist._id },
                { $push: { message: message._id }, $set: { isRead: false, userReceive: body.userReceive } },
                { new: true }
            );
            return updateConversation;
        } else {
            const conversationSchema = new Conversation({
                _id: new mongoose.Types.ObjectId(),
                message: [message._id],
                users: message.users,
                userReceive: body.userReceive,
            });
            const result = await conversationSchema.save();
            return result;
        }
    },

    async updateIsRead(user, body) {
        console.log(body);
        const conversation = await Conversation.findById(body.conversationId);
        if (!conversation) throw new ResponseModel(500, ["Không tồn tại tin nhắn"], null);

        if (conversation.isRead) return conversation;

        const result = await Conversation.findOneAndUpdate(
            { _id: body.conversationId, userReceive: user },
            { $set: { isRead: true } },
            { new: true }
        );
        console.log(result);
        return result;
    },

    async getConversations(user) {
        try {
            const userId = user._id.toString();
            const conversations = await Conversation.find({ users: { $in: [userId] } }).sort({ updatedAt: -1 });

            // If you want to get the last message of each conversation
            const conversationsWithLastMessage = await Promise.all(
                conversations.map(async (conversation) => {
                    const lastMessageId = conversation.message[conversation.message.length - 1];
                    const lastMessage = await Message.findById(lastMessageId);
                    const isUserSend = lastMessage.users[0] === userId;
                    const partner = isUserSend ? lastMessage.users[1] : lastMessage.users[0];
                    const userPartner = await User.findById(partner);

                    return { ...conversation.toObject(), lastMessage, isUserSend, userPartner };
                })
            );

            return conversationsWithLastMessage;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async countConversationsNotRead(user) {
        try {
            const userId = user._id.toString();
            const count = await Conversation.countDocuments({ userReceive: userId, isRead: false });
            return count;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

export default ConversationService;
