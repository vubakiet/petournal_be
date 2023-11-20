import Following from "../models/base/Following.js";
import mongoose from "mongoose";
import User from "../models/base/User.js";
import ResponseModel from "../models/response/ResponseModel.js";
import Follower from "../models/base/Follower.js";

const FollowService = {
    async getFollowings() {
        const followings = await Following.find();
        return followings;
    },

    async getFollowingById(followingId){
        const following = await Following.findById(followingId);
        return following;
    },

    async getFollowers() {
        const followers = await Follower.find();
        return followers;
    },

    async getFollowerById(followerId){
        const follower = await Follower.findById(followerId);
        return follower;
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
            following: followingUser
        });
        await Follower.findOneAndDelete({
            user: followingUser
        })

        return result;
    }
};

export default FollowService;
