import Comment from "../models/base/Comment.js";
import mongoose from "mongoose";
import ResponseModel from "../models/response/ResponseModel.js";

const CommentService = {
    async createComment(user, post_id, comment) {

        console.log(comment.parent_id);
        try {
            if (comment.parent_id) {
                const commentCreated = await Comment.findById(comment.parent_id)

                console.log(commentCreated);

                if(commentCreated){
                    const commentSchema = new Comment({
                        _id: new mongoose.Types.ObjectId(),
                        parent_id: comment.parent_id,
                        user,
                        post: post_id,
                        ...comment,
                    });
    
                    const commentSaved = await commentSchema.save();
    
                    console.log({ commentSaved });
                    return commentSaved;
                }
                else{
                    return new ResponseModel(400, ["Lỗi trả lời bình luận", null])
                }
                
            } else {
                const commentSchema = new Comment({
                    _id: new mongoose.Types.ObjectId(),
                    parent_id: new mongoose.Types.ObjectId(),
                    user,
                    post: post_id,
                    ...comment,
                });

                const commentSaved = await commentSchema.save();

                console.log({ commentSaved });
                return commentSaved;
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default CommentService;
