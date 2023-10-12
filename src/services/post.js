import mongoose from "mongoose";
import Post from "../models/base/Post.js";

const PostService = {

    async createPost(post) {
        try {
            const postSchema = new Post({
                _id: new mongoose.Types.ObjectId(),
                ...post
            })
        } catch (error) {
            console.log(error);
        }
    }
}