import Following from "../models/base/Following.js";
import mongoose from "mongoose";
import User from "../models/base/User.js";
import ResponseModel from "../models/response/ResponseModel.js";
import Follower from "../models/base/Follower.js";
import Pet from "../models/base/Pet.js";
import Conversation from "../models/base/Conversation.js";

const FollowService = {
    async getFollowings() {
        const followings = await Following.find();
        return followings;
    },

    async getFollowingById(followingId) {
        const following = await Following.findById(followingId);
        return following;
    },

    async getFollowers() {
        const followers = await Follower.find();
        return followers;
    },

    async getFollowerById(followerId) {
        const follower = await Follower.findById(followerId);
        return follower;
    },

    async getFollowingsByUserPagination(user, body) {
        const page = body.page || 1;
        const limit = body.limit || 6;
        const skip = (page - 1) * limit;

        let sortOption = {};
        const { sortBy } = body;

        if (sortBy === "newest") {
            sortOption = { createdAt: -1 }; // Sort by descending order of creation date
        } else if (sortBy === "oldest") {
            sortOption = { createdAt: 1 }; // Sort by ascending order of creation date
        }

        const followings = await Following.find({ user: user })
            .populate("following")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalFollowings = await Following.countDocuments({ user: user });
        const totalPages = Math.ceil(totalFollowings / limit);

        let listFollowing = await Promise.all(
            followings.map(async (following) => {
                const userId = following.following._id;
                const petsUser = await Pet.countDocuments({ user: userId });
                const followingsUser = await Following.countDocuments({ user: userId });
                const followersUser = await Follower.countDocuments({ user: userId });

                return {
                    ...following.toObject(),
                    petsUser,
                    followingsUser,
                    followersUser,
                    isFollowing: true,
                };
            })
        );

        return { listFollowing, totalPages, totalFollowings };
    },

    async getFollowingsByUser(user) {
        const followings = await Following.find({ user }).populate("following");

        let listFollowing = await Promise.all(
            followings.map(async (following) => {
                const conversation = await Conversation.findOne({
                    users: { $all: [user._id.toString(), following.following._id.toString()] },
                });
                console.log(conversation);
                return {
                    ...following.toObject(),
                    isChat: conversation ? true : false,
                };
            })
        );
        return listFollowing;
    },

    async getFollowersByUser(user, body) {
        const page = body.page || 1;
        const limit = body.limit || 6;
        const skip = (page - 1) * limit;

        let sortOption = {};
        const { sortBy } = body;

        if (sortBy === "newest") {
            sortOption = { createdAt: -1 }; // Sort by descending order of creation date
        } else if (sortBy === "oldest") {
            sortOption = { createdAt: 1 }; // Sort by ascending order of creation date
        }

        const followers = await Follower.find({ user: user })
            .populate("follower")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalFollowers = await Follower.countDocuments({ user: user });
        const totalPages = Math.ceil(totalFollowers / limit);

        let listFollower = await Promise.all(
            followers.map(async (follower) => {
                const userId = follower.follower._id;
                const petsUser = await Pet.countDocuments({ user: userId });
                const followingsUser = await Following.countDocuments({ user: userId });
                const followersUser = await Follower.countDocuments({ user: userId });
                const isFollowing = await Following.exists({ user: user, following: userId });

                return {
                    ...follower.toObject(),
                    petsUser,
                    followingsUser,
                    followersUser,
                    isFollowing: Boolean(isFollowing),
                };
            })
        );

        return { listFollower, totalPages, totalFollowers };
    },

    async followUser(user, id) {
        try {
            const userFollow = await User.findById(id);

            const followedUser = await Following.findOne({
                user: user,
                following: userFollow,
            });

            if (!followedUser) {
                const followingSchema = new Following({
                    _id: new mongoose.Types.ObjectId(),
                    user,
                    following: userFollow,
                });

                const followerSchema = new Follower({
                    _id: new mongoose.Types.ObjectId(),
                    user: userFollow,
                    follower: user,
                });
                await followerSchema.save();

                const result = await followingSchema.save();
                return result;
            } else {
                return new ResponseModel(404, "User was Followed");
            }
        } catch (error) {
            console.log(error);
        }
    },

    async unFollowUser(id) {
        const followingUser = await User.findById(id);

        const result = await Following.findOneAndDelete({
            following: followingUser,
        });
        await Follower.findOneAndDelete({
            user: followingUser,
        });

        return result;
    },
    async filterFollower(user, body) {
        try {
            const { keyword } = body;
            const userId = user._id.toString();

            const followers = await Follower.find({ user: userId }).populate("follower");

            const followersWithKeywords = await Promise.all(
                followers.map(async (follower) => {
                    const keywordsArray = keyword.split(/\s+/).filter(Boolean);

                    // Build an array of conditions for each keyword
                    const conditions = keywordsArray.map((kw) => ({
                        $or: [
                            { lastName: { $regex: kw, $options: "i" } },
                            { firstName: { $regex: kw, $options: "i" } },
                            { email: { $regex: kw, $options: "i" } },
                        ],
                    }));

                    const user = await User.findOne({
                        _id: follower.follower._id,
                        $and: conditions.length > 0 ? conditions : [{}],
                    });
                    if (user !== null) {
                        return user;
                    }
                })
            );

            const filteredFollowers = followersWithKeywords.filter((user) => user !== undefined);

            return filteredFollowers;
        } catch (error) {
            console.error("Error filtering followers ", error);
            throw error; // Handle the error appropriately in your application
        }
    },
    async filterFollowing(user, body) {
        try {
            const { keyword } = body;
            const userId = user._id.toString();

            const followings = await Following.find({ user: userId }).populate("following");

            const followingsWithKeywords = await Promise.all(
                followings.map(async (following) => {
                    const keywordsArray = keyword.split(/\s+/).filter(Boolean);

                    // Build an array of conditions for each keyword
                    const conditions = keywordsArray.map((kw) => ({
                        $or: [
                            { lastName: { $regex: kw, $options: "i" } },
                            { firstName: { $regex: kw, $options: "i" } },
                            { email: { $regex: kw, $options: "i" } },
                        ],
                    }));

                    const user = await User.findOne({
                        _id: following.following._id,
                        $and: conditions.length > 0 ? conditions : [{}],
                    });

                    if (user !== null) {
                        return user;
                    }
                })
            );

            const filteredFollowings = followingsWithKeywords.filter((user) => user !== undefined);

            return filteredFollowings;
        } catch (error) {
            console.error("Error filtering followings ", error);
            throw error; // Handle the error appropriately in your application
        }
    },
};

export default FollowService;
