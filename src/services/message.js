import mongoose from "mongoose";
import Message from "../models/base/Message.js";
import ConversationService from "./conversation.js";
import Conversation from "../models/base/Conversation.js";

const MessageService = {
    async addMessage(user, body) {
        try {
            const { to, message, imageUrl } = body;

            const from = user._id.toString();

            const messageSchema = new Message({
                _id: new mongoose.Types.ObjectId(),
                users: [from, to],
                sender: from,
                message: message,
                imageUrl: imageUrl,
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
            const page = body.page || 1;
            const limit = body.limit || 50;
            const skip = (page - 1) * limit;

            const from = user._id.toString();

            const messages = await Message.find({
                users: {
                    $all: [from, to],
                },
            })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit);

            const projectedMessages = messages.map((msg) => {
                return {
                    _id: msg._id,
                    fromSelf: msg.sender.toString() === from,
                    message: msg.message,
                    imageUrl: msg.imageUrl,
                    createdAt: msg.createdAt,
                    updatedAt: msg.updatedAt,
                };
            });

            return projectedMessages;
        } catch (error) {
            console.log(error);
        }
    },

    async deleteMessage(user, body) {
        try {
            const { messageId } = body;
            const from = user._id.toString();
            const result = await Message.findOneAndDelete({ _id: messageId, users: { $in: [from] } });
            if (result) {
                await Conversation.updateOne({ message: { $in: [result._id] } }, { $pull: { message: result._id } });
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default MessageService;
