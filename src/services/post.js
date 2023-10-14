import mongoose from "mongoose";
import Post from "../models/base/Post.js";

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
            const post = await Post.findById({ _id: id });
            return post;
        } catch (error) {
            console.log(error);
        }
    },

    async createPost(user, post) {
        try {
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
};

export default PostService;
