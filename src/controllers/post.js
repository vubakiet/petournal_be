import ResponseModel from "../models/response/ResponseModel.js";
import PostService from "../services/post.js";

const PostController = {
    async getPosts(req, res, next) {
        try {
            const result = await PostService.getPosts();
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách bài viết"], null));
        }
    },

    async getPostById(req, res, next) {
        try {
            const result = await PostService.getPostById(req.params.id);
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách bài viết"], null));
        }
    },

    async createPost(req, res, next) {
        try {
            const result = await PostService.createPost(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi thêm bài viết"], null));
        }
    },
    async updatePost(req, res, next) {
        try {
            const result = await PostService.updatePost(req.user, req.params.id, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi sửa bài viết"], null));
        }
    },

    async deletePost(req, res, next) {
        try {
            const result = await PostService.deletePost(req.user, req.params.id);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi xoá bài viết"], null));
        }
    },

    async likePost(req, res, next) {
        try {
            const result = await PostService.likePost(req.user, req.params.id);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi thích bài viết"], null));
        }
    },
};

export default PostController;
