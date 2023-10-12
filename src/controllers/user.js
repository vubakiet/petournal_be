import ResponseModel from "../models/response/ResponseModel.js";
import UserService from "../services/user.js";

const UserController = {
    async getUsers(req, res, next) {
        try {
            const result = await UserService.getUsers();
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi thêm thông tin người dùng"], null));
        }
    },

    async getUserById(req, res, next) {
        try {
            console.log(req);
            const result = await UserService.getUserById(req.params.id);
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi thêm thông tin người dùng"], null));
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
