import Comment from "../models/base/Comment.js";
import Post from "../models/base/Post.js";
import mongoose from "mongoose";
import ResponseModel from "../models/response/ResponseModel.js";

const CommentService = {
    async createComment(user, commentBody) {
        try {
            const post = await Post.findOne({ _id: commentBody.post_id });

            if (!post) throw new ResponseModel(400, ["Không tìm thấy bài viết"], null);

            if (commentBody.comment_id) {
                const commentCreated = await Comment.findById(commentBody.comment_id);

                if (commentCreated) {
                    const commentSchema = new Comment({
                        _id: new mongoose.Types.ObjectId(),
                        parent_id: commentCreated.parent_id,
                        user,
                        post: commentBody.post_id,
                        ...commentBody,
                    });

                    const commentSaved = await commentSchema.save();

                    return commentSaved;
                }
            } else {
                const commentSchema = new Comment({
                    _id: new mongoose.Types.ObjectId(),
                    user,
                    post: commentBody.post_id,
                    ...commentBody,
                });

                commentSchema.parent_id = commentSchema._id;

                const commentSaved = await commentSchema.save();

                return commentSaved;
            }
        } catch (error) {
            console.log(error);
        }
    },

    async getComments(commentBody) {
        try {
            const post = await Post.findOne({ _id: commentBody.post_id });

            if (!post) throw new ResponseModel(400, ["Không tìm thấy bài viết"], null);

            const comments = await Comment.find({
                post: post,
                $expr: { $eq: ["$_id", "$parent_id"] },
            }).limit(commentBody.limit || 5);

            return comments;
        } catch (error) {
            console.log(error);
        }
    },

    async getCommentsChild(commentBody) {
        try {
            const post = await Post.findOne({ _id: commentBody.post_id });
            if (!post) throw new ResponseModel(400, ["Không tìm thấy bài viết"], null);

            const comment = await Comment.findById({ _id: commentBody.comment_id });
            if (!comment) throw new ResponseModel(400, ["Không tìm thấy bình luận"], null);

            const listCommentChild = await Comment.find({
                post: post,
                parent_id: comment.parent_id,
                $expr: { $ne: ["$_id", "$parent_id"] },
            });

            return listCommentChild;
        } catch (error) {
            console.log(error);
        }
    },

    async updateComment(user, commentBody) {
        console.log(commentBody);
        try {
            const post = await Post.findOne({ _id: commentBody.post_id });
            if (!post) throw new ResponseModel(400, ["Không tìm thấy bài viết"], null);

            const comment = await Comment.findById({ _id: commentBody.comment_id });
            if (!comment) throw new ResponseModel(400, ["Không tìm thấy bình luận"], null);

            const commentUpdate = await Comment.findOneAndUpdate(
                {
                    _id: comment._id,
                    user: user,
                },
                {
                    $set:{text: commentBody.text}
                },
                {new: true}
            );

            console.log(commentUpdate);

            return commentUpdate;
        } catch (error) {
            console.log(error);
        }
    },

    async deleteComment(user, comment_id){
        try {
            const comment = await Comment.findById({ _id: comment_id });
            if (!comment) throw new ResponseModel(400, ["Không tìm thấy bình luận"], null);

            await Comment.findByIdAndDelete({_id: comment_id});

            return new ResponseModel(200, ["Xoá bình luận thành công"], null)
        } catch (error) {
            console.log(error);
        }
    }
};

export default CommentService;
