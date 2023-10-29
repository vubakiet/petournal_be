import ConversationService from "../services/conversation.js";

const ConversationController = {
    async addMessage(req, res, next) {
        const result = await ConversationService.addMessage(req.body);
        res.json(result);
    },

    async getMessages(req, res, next) {
        const result = await ConversationService.getMessages(req.body);
        res.json(result);
    },
};


export default ConversationController
