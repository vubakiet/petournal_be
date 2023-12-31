import ResponseModel from "../models/response/ResponseModel.js";
import FollowService from "../services/follow.js";

const FollowController = {
    async getFollowings(req, res, next) {
        const result = await FollowService.getFollowings();
        res.json(result);
    },

    async getFollowingById(req, res, next) {
        const result = await FollowService.getFollowingById(req.params.id);
        res.json(result);
    },

    async getFollowers(req, res, next) {
        const result = await FollowService.getFollowers();
        res.json(result);
    },

    async getFollowerById(req, res, next) {
        const result = await FollowService.getFollowerById(req.params.id);
        res.json(result);
    },

    async getFollowingsByUserPagination(req, res, next) {
        const result = await FollowService.getFollowingsByUserPagination(req.user, req.body);
        res.json(result);
    },

    async getFollowingsByUser(req, res, next) {
        const result = await FollowService.getFollowingsByUser(req.user, req.body);
        res.json(result);
    },

    async getFollowersByUser(req, res, next) {
        const result = await FollowService.getFollowersByUser(req.user, req.body);
        res.json(result);
    },

    async followUser(req, res, next) {
        try {
            const result = await FollowService.followUser(req.user, req.params.id);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi theo dõi người dùng"], null));
        }
    },

    async unFollowUser(req, res, next) {
        const result = await FollowService.unFollowUser(req.params.id);
        res.json(result);
    },

    async filterFollower(req, res, next) {
        try {
            const response = await FollowService.filterFollower(req.user, req.body);
            res.json(response);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Cập nhật thất bại"], null));
        }
    },
    async filterFollowing(req, res, next) {
        try {
            const response = await FollowService.filterFollowing(req.user, req.body);
            res.json(response);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Cập nhật thất bại"], null));
        }
    },
};

export default FollowController;
