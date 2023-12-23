import ResponseModel from "../models/response/ResponseModel.js";
import NotificationService from "../services/notification.js";

const NotificationController = {
    async getUserNotification(req, res, next) {
        try {
            const result = await NotificationService.getUserNotification(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách thông báo"], null));
        }
    },
    async updateIsRead(req, res, next) {
        try {
            const result = await NotificationService.updateIsRead(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi thay đổi đánh dấu đã đọc"], null));
        }
    },
    async createNotification(req, res, next) {
        try {
            const result = await NotificationService.createNotification(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi tạo thông báo"], null));
        }
    },
    async isUserNotificationExist(req, res, next) {
        try {
            const result = await NotificationService.isUserNotificationExist(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi kiểm tra thông báo"], null));
        }
    },
};

export default NotificationController;
