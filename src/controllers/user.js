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

    async getProfileUser(req, res, next) {
        try {
            const result = await UserService.getProfileUser(req.user, req.params.id);
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy thông tin người dùng"], null));
        }
    },

    async getUsersRecommend(req, res, next) {
        try {
            const result = await UserService.getUsersRecommend(req.user);
            res.json(result);
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

    async changePassword(req, res, next) {
        try {
            const response = await UserService.changePassword(req.user, req.body);
            if (response) {
                res.cookie("refreshTokenPetournal", response.result.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                delete response.result.refreshToken;
                return res.json(response);
            }
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Sai mật khẩu hiện tại"], null));
        }
    },
    async updateUser(req, res, next) {
        try {
            const response = await UserService.updateUser(req.user, req.body);
            res.json(response);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Cập nhật thất bại"], null));
        }
    },
};

export default UserController;
