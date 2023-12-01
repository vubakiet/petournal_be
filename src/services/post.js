import mongoose from "mongoose";
import Post from "../models/base/Post.js";
import ResponseModel from "../models/response/ResponseModel.js";
import Pet from "../models/base/Pet.js";
import Comment from "../models/base/Comment.js";

const PostService = {
    async getPosts() {
        try {
            const posts = await Post.find();
            return posts;
        } catch (error) {
            console.log(error);
        }
    },

    async getPostById(id) {
        try {
            const post = await Post.findById({ _id: id }).populate("user").populate("pets");
            return post;
        } catch (error) {
            console.log(error);
        }
    },

    async createPost(user, post) {
        console.log(post);
        try {
            await Promise.all(
                post.pets.map(async (pet_id) => {
                    const pet = await Pet.findById(pet_id);
                    if (pet.user._id.toString() != user._id.toString()) {
                        throw new ResponseModel(400, ["Không tìm thấy pet"], null);
                    }
                })
            );

            const postSchema = new Post({
                _id: new mongoose.Types.ObjectId(),
                user,
                ...post,
            });

            const result = await postSchema.save();
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async updatePost(user, post_id, body) {
        const { content, imageUrl } = body;
        console.log(user, post_id, body);
        if (!content && !imageUrl) {
            throw new ResponseModel(500, ["Không chứa nội dung"], null);
        }

        const post = await Post.findById(post_id);
        if (!post) throw new ResponseModel(500, ["Không tìm thấy bài viết"], null);
        const updatePost = await Post.findOneAndUpdate(
            { _id: post_id, user },
            { $set: { content, imageUrl } },
            { new: true }
        ).populate('user');

        return updatePost;
    },

    async deletePost(user, id) {
        const post = await Post.findOne({
            _id: id,
            user: user._id.toString(),
        });
        if (!post) {
            return new ResponseModel(500, ["Không tìm thấy bài viết"]);
        }

        const deletePost = await Post.findByIdAndDelete(id);
        if (deletePost) {
            await Comment.deleteMany({ post: post });
        }

        return deletePost;
    },

    async likePost(user, post_id) {
        try {
            const post = await Post.findById(post_id);
            if (!post) throw new ResponseModel(400, ["Không tìm thấy bài viết"], null);

            const likedByUser = post.likes.includes(user._id.toString());

            let postUpdate;

            if (likedByUser) {
                postUpdate = await Post.findOneAndUpdate(
                    { _id: post._id },
                    { $pull: { likes: user._id.toString() } },
                    { new: true }
                );
            } else {
                postUpdate = await Post.findOneAndUpdate(
                    { _id: post._id },
                    { $push: { likes: user._id.toString() } },
                    { new: true }
                );
            }

            return postUpdate.likes;
        } catch (error) {
            console.log(error);
        }
    },
};

export default PostService;
