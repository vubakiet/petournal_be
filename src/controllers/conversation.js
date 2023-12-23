import ConversationService from "../services/conversation.js";

const ConversationController = {
    async getConversations(req, res, next) {
        const result = await ConversationService.getConversations(req.user);
        res.json(result);
    },
    async updateIsRead(req, res, next) {
        try {
            const result = await ConversationService.updateIsRead(req.user, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    async countConversationsNotRead(req, res, next) {
        try {
            const result = await ConversationService.countConversationsNotRead(req.user);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};

export default ConversationController;
