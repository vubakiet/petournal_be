import mongoose from "mongoose";
import Conversation from "../models/base/Conversation.js";

const ConversationService = {
    async addMessage(conversationBody) {
        try {
            const { from, to, message } = conversationBody;

            const conversationSchema = new Conversation({
                _id: new mongoose.Types.ObjectId(),
                users: [from, to],
                sender: from,
                message: message,
            });

            const result = await conversationSchema.save();
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async getMessages(conversationBody) {
        try {
            const { from, to } = conversationBody;

            const messages = await Conversation.find({
                users: {
                    $all: [from, to],
                },
            }).sort({ updatedAt: 1 });

            const projectedMessages = messages.map((msg) => {
                return {
                    fromSelf: msg.sender.toString() === from,
                    message: msg.message,
                };
            });

            return projectedMessages;
        } catch (error) {
            console.log(error);
        }
    },
};

export default ConversationService;
