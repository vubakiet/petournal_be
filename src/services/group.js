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

        const followerCounts = await Promise.all(
            users.map(async (user) => {
                const totalFollowers = await Follower.countDocuments({ user: user._id });
                const isLeader = await Group.exists({ owner: user._id });
                return { user, totalFollowers, isLeader };
            })
        );

        return followerCounts;
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

    async getListUserInviteOfGroup(user, groupId) {
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

        const groupMembers = await Group.findById(groupId).select("members");

        // Filter out users who are members of the specified group
        const filteredUsers = listUsers.filter((userId) => !groupMembers.members.includes(userId));

        // Retrieve user details for the filtered users
        const users = await User.find({ _id: { $in: filteredUsers } });

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

    async addUserToGroup(loggedInUser, body) {
        const { groupId, users } = body;

        // Ensure the user making the request is a member of the group
        const group = await Group.findOne({ _id: groupId, members: loggedInUser._id.toString() });
        if (!group) {
            throw new ResponseModel(500, ["User không thuộc nhóm"]);
        }

        // Use $addToSet to ensure unique members in the array
        const updatedGroup = await Group.findByIdAndUpdate(
            group._id,
            { $addToSet: { members: { $each: users } } },
            { new: true }
        );

        return updatedGroup;
    },

    async filterGroup(user, body) {
        try {
            const { keyword } = body;
            const userId = user._id.toString();

            // Split the keyword into an array of individual words
            const keywordsArray = keyword.split(/\s+/).filter(Boolean);

            // Build an array of conditions for each keyword
            const conditions = keywordsArray.map((kw) => ({ name: { $regex: kw, $options: "i" } }));

            // Combine conditions with $and to match all keywords
            const groups = await Group.find({
                $and: conditions.length > 0 ? conditions : [{}],
                members: { $in: [userId] },
            });

            return groups;
        } catch (error) {
            console.error("Error filtering groups:", error);
            throw error; // Handle the error appropriately in your application
        }
    },
};

export default GroupService;
