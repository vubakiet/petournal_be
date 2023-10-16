import ResponseModel from "../models/response/ResponseModel.js"
import NotificationService from "../services/notification.js"


const NotificationController = {
    async createNotification(req, res, next){
        try {
            const result = await NotificationService.createNotification(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi tạo thông báo"], null))
        }
    }
}

export default NotificationController;