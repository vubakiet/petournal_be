import mongoose from "mongoose";
import Post from "../models/base/Post.js";
import ResponseModel from "../models/response/ResponseModel.js";
import Pet from "../models/base/Pet.js";

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

    async likePost(user, post_id) {
        try {
            console.log(post_id);
            const post = await Post.findById(post_id);
            if (!post) throw new ResponseModel(400, ["Không tìm thấy bài viết"], null);

            const likedByUser = post.likes.includes(user._id.toString());
            console.log(likedByUser);

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
