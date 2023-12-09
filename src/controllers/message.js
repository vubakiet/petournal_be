import MessageService from "../services/message.js";

const MessageController = {
    async addMessage(req, res, next) {
        const result = await MessageService.addMessage(req.user, req.body);
        res.json(result);
    },

    async getMessages(req, res, next) {
        const result = await MessageService.getMessages(req.user, req.body);
        res.json(result);
    },
};


export default MessageController