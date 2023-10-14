import ResponseModel from "../models/response/ResponseModel.js"
import CommentService from "../services/comment.js";

 const CommentController = {
    async createComment(req, res, next){
        try {
            const result = await CommentService.createComment(req.user, req.params.id, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi tạo bình luận"], null))
        }
    }
 }

 export default CommentController;