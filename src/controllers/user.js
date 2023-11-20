import ResponseModel from "../models/response/ResponseModel.js";
import UserService from "../services/user.js";

const UserController = {
    async getUsers(req, res, next) {
        try {
            const result = await UserService.getUsers();
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách người dùng"], null));
        }
    },

    async getUserById(req, res, next) {
        try {
            const result = await UserService.getUserById(req.params.id);
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy thông tin người dùng"], null));
        }
    },

    async getUsersRecommend(req, res, next) {
        try {
            const result = await UserService.getUsersRecommend(req.user);
            res.json(result)
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách người dùng giới thiệu"], null));
        }
    },

    async createUser(req, res, next) {
        try {
            const result = await UserService.createUser(req.body);
            return res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi thêm thông tin người dùng"], null));
        }
    },
};

export default UserController;
