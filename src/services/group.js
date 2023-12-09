import mongoose from "mongoose";
import Group from "../models/base/Group.js";
import ResponseModel from "../models/response/ResponseModel.js";
import User from "../models/base/User.js";
import Following from "../models/base/Following.js";
import Post from "../models/base/Post.js";

const GroupService = {
    async getGroupById(group_id) {
        const group = await Group.findById(group_id);
        return group;
    },

    async getMembers(body) {
        const { members } = body;

        const users = await User.find({ _id: { $in: members } });

        return users;
    },

    async createGroup(user, body) {
        const { name, describe, avatar, members } = body;

        if (members?.length < 3) {
            throw new ResponseModel(500, ["Số lượng thành viên phải từ 3 trở lên"]);
        }

        if (!name || !describe || !avatar) {
            throw new ResponseModel(500, ["Tạo nhóm thất bại"], null);
        }

        const groupSchema = new Group({
            _id: new mongoose.Types.ObjectId(),
            owner: user,
            ...body,
        });

        const result = groupSchema.save();

        return result;
    },

    async getGroupsByUserLogin(user) {
        const userId = user._id.toString();

        const groups = await Group.find({ members: { $in: [userId] } });

        return groups;
    },

    async getGroupsByOwner(user) {
        const groups = await Group.find({ owner: user });

        return groups;
    },

    async addPostToGroup(body) {
        const group = await Group.findById(body.group_id);
        if (!group) throw new ResponseModel(500, ["Không tìm thấy nhóm"], null);

        const groupUpdate = await Group.findOneAndUpdate(
            { _id: group._id },
            { $push: { posts: body.post_id } },
            { new: true }
        );

        return groupUpdate;
    },

    async getPostsFromGroup(user, body) {
        const page = body.page || 1;
        const limit = body.limit || 3;
        const skip = (page - 1) * limit;

        const group = await Group.findById(body.group_id);
        if (!group) throw new ResponseModel(500, ["Không tìm thấy nhóm"], null);

        const postsPostId = group.posts;
        if (postsPostId.length > 0) {
            const posts = await Post.find({ _id: { $in: postsPostId } })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

                console.log(posts);

            let listPosts = posts.map((post) => ({ ...post.toObject() }));

            await Promise.all(
                listPosts.map(async (post) => {
                    const userId = user._id.toString();
                    const isLiked = post.likes.includes(userId);
                    const isFollowing = await Following.exists({ user, following: post.user });

                    post.isLiked = isLiked;
                    post.isFollowing = Boolean(isFollowing);
                })
            );

            return listPosts;
        }

        // return new ResponseModel(500, ["Không tìm thấy bài viếtÏ"], null);
    },
};

export default GroupService;
