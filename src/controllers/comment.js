import ResponseModel from "../models/response/ResponseModel.js"
import CommentService from "../services/comment.js";

 const CommentController = {
    async createComment(req, res, next){
        try {
            const result = await CommentService.createComment(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi tạo bình luận"], null))
        }
    },

    async getComments(req, res, next){
        try {
            const result = await CommentService.getComments(req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh  bình luận"], null))
        }
    },

    async getCommentsChild(req, res, next){
        try {
            const result = await CommentService.getCommentsChild(req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh bình luận con"], null))
        }
    },

    async updateComment(req, res, next){
        try {
            const result = await CommentService.updateComment(req.user, req.body);
            res.json(result)
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi sửa bình luận con"], null))
        }
    },

    async deleteComment(req, res, next){
        try {
            const result = await CommentService.deleteComment(req.user, req.params.id);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi xoá bình luận"], null))
        }
    }
 }

 export default CommentController;