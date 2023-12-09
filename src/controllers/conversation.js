import ConversationService from "../services/conversation.js";

const ConversationController = {
    async getConversations(req, res, next) {
        const result = await ConversationService.getConversations(req.user);
        res.json(result);
    },
};

export default ConversationController;
