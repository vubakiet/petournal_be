import Comment from "../models/base/Comment.js";
import Post from "../models/base/Post.js";
import mongoose from "mongoose";
import ResponseModel from "../models/response/ResponseModel.js";
import { populate } from "dotenv";

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

            const page = commentBody.page || 1; // default to page 1
            const limit = commentBody.limit || 3;
            const skip = (page - 1) * limit;
            const position = commentBody.position || null;

            const totalCommentParent = await Comment.countDocuments({
                post: post,
                $expr: { $eq: ["$_id", "$parent_id"] },
            });

            let query = {
                post: post,
                $expr: { $eq: ["$_id", "$parent_id"] },
            };

            if (position !== null && position !== undefined) {
                query.createdAt = { $lt: position };
            }

            const comments = await Comment.find(query).populate("user").sort({ createdAt: 1 }).skip(skip).limit(limit);

            return { comments, totalCommentParent };
        } catch (error) {
            console.log(error);
        }
    },

    async getTotalCommentCount(commentBody) {
        const post = await Post.findOne({ _id: commentBody.post_id });
        if (!post) throw new ResponseModel(400, ["Không tìm thể bài viết"], null);

        const totalCommentCount = await Comment.countDocuments({ post: post });
        return totalCommentCount;
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
            })
                .populate("user")
                .sort({ createdAt: 1 });

            return listCommentChild;
        } catch (error) {
            console.log(error);
        }
    },

    async updateComment(user, commentBody) {
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
                    $set: { text: commentBody.text },
                },
                { new: true }
            );

            return commentUpdate;
        } catch (error) {
            console.log(error);
        }
    },

    async deleteComment(user, comment_id) {
        try {
            const comment = await Comment.findOne({
                _id: comment_id,
            }).populate("post");

            if (comment.user.toString() != user._id.toString() && comment.post.user.toString() != user._id.toString()) {
                throw new ResponseModel(400, ["Không tìm thấy bình luận"], null);
            }

            if (comment.parent_id == comment_id) {
                const comments = await Comment.find({ parent_id: comment_id });
                comments.forEach(async (comment) => {
                    await Comment.findByIdAndDelete({ _id: comment._id });
                });
            } else {
                await Comment.findByIdAndDelete({ _id: comment_id });
            }

            return new ResponseModel(200, ["Xoá bình luận thành công"], null);
        } catch (error) {
            console.log(error);
        }
    },
};

export default CommentService;
