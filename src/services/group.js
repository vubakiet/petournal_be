import mongoose from "mongoose";
import Group from "../models/base/Group.js";
import ResponseModel from "../models/response/ResponseModel.js";
import User from "../models/base/User.js";
import Following from "../models/base/Following.js";
import Follower from "../models/base/Follower.js";
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

        if (!members || members?.length < 3) {
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

    async getGroupsByUserLogin(user, body) {
        const userId = user._id.toString();
        const page = body.page || 1;
        const limit = body.limit || 6;
        const skip = (page - 1) * limit;

        const groups = await Group.find({ members: { $in: [userId] } })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalGroups = await Group.countDocuments({ members: { $in: [userId] } });
        const totalPages = Math.ceil(totalGroups / limit);

        return { groups, totalPages };
    },

    async getGroupsByOwner(user, body) {
        const page = body.page || 1;
        const limit = body.limit || 6;
        const skip = (page - 1) * limit;

        const groups = await Group.find({ owner: user }).skip(skip).limit(limit).sort({ createdAt: -1 });

        const totalGroups = await Group.countDocuments({ owner: user });
        const totalPages = Math.ceil(totalGroups / limit);

        return { groups, totalPages };
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

    async getListUserInvite(user) {
        const followings = await Following.find({ user });

        let listUsers = [];

        await Promise.all(
            followings.map(async (following) => {
                const follow = await Following.findOne({ user: following.following, following: user });
                if (follow) {
                    listUsers.push(follow.user);
                }
            })
        );

        const users = await User.find({ _id: { $in: listUsers } });

        return users;
    },

    async updateProfileGroup(user, body) {
        const { name, avatar, describe } = body;

        if (!name || !describe || !avatar) {
            throw new ResponseModel(500, ["Tạo nhóm thất bại"], null);
        }

        const group = await Group.findById(body.group_id);
        if (!group) throw new ResponseModel(500, ["Không tìm thấy nhóm"], null);

        const updateProfile = await Group.findOneAndUpdate(
            { _id: group._id, owner: user },
            { $set: { ...body } },
            { new: true }
        );

        return updateProfile;
    },
};

export default GroupService;
