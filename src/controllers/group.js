import ResponseModel from "../models/response/ResponseModel.js";
import GroupService from "../services/group.js";

const GroupController = {
    async getGroupById(req, res, next) {
        try {
            const result = await GroupService.getGroupById(req.params.id);
            if (result) {
                res.json(result);
            }
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy chi tiết nhóm"], null));
        }
    },

    async getMembers(req, res, next) {
        try {
            const result = await GroupService.getMembers(req.body);
            if (result) {
                res.json(result);
            }
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi danh sách thành viên nhóm"], null));
        }
    },

    async createGroup(req, res, next) {
        try {
            const result = await GroupService.createGroup(req.user, req.body);
            if (result) {
                res.json(result);
            } else {
                return res.status(500).json(new ResponseModel(500, ["Vui lòng cung cấp đầy đủ thông tin"], null));
            }
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Vui lòng cung cấp đầy đủ thông tin "], null));
        }
    },

    async getGroupsByUserLogin(req, res, next) {
        try {
            const result = await GroupService.getGroupsByUserLogin(req.user);
            if (result) {
                res.json(result);
            }
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách nhóm"], null));
        }
    },

    async getGroupsByOwner(req, res, next) {
        try {
            const result = await GroupService.getGroupsByOwner(req.user);
            if (result) {
                res.json(result);
            }
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách nhóm"], null));
        }
    },

    async addPostToGroup(req, res, next) {
        try {
            const result = await GroupService.addPostToGroup(req.body);
            if (result) {
                res.json(result);
            }
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi tạo bài viết trong nhóm"], null));
        }
    },

    async getPostsFromGroup(req, res, next) {
        try {
            const result = await GroupService.getPostsFromGroup(req.user, req.body);
            if (result) {
                res.json(result);
            }
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách bài viết trong nhóm"], null));
        }
    },
};

export default GroupController;
