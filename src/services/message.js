import mongoose from "mongoose";
import Message from "../models/base/Message.js";
import ConversationService from "./conversation.js";

const MessageService = {
    async addMessage(user, body) {
        try {
            const { to, message } = body;

            const from = user._id.toString();

            const messageSchema = new Message({
                _id: new mongoose.Types.ObjectId(),
                users: [from, to],
                sender: from,
                message: message,
            });

            const result = await messageSchema.save();

            if (result) {
                await ConversationService.createConversation({ messageId: result._id, userReceive: to });
            }
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async getMessages(user, body) {
        try {
            const { to } = body;
            const from = user._id.toString();

            const messages = await Message.find({
                users: {
                    $all: [from, to],
                },
            }).sort({ updatedAt: 1 });

            const projectedMessages = messages.map((msg) => {
                return {
                    _id: msg._id,
                    fromSelf: msg.sender.toString() === from,
                    message: msg.message,
                    createdAt: msg.createdAt,
                    updatedAt: msg.updatedAt,
                };
            });

            return projectedMessages;
        } catch (error) {
            console.log(error);
        }
    },
};

export default MessageService;
