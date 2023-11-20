import mongoose from "mongoose";
import User from "../models/base/User.js";
import { hashPassword } from "../utils/hashPassword.js";
import Following from "../models/base/Following.js";
import Follower from "../models/base/Follower.js";

const UserService = {
    async getUsers() {
        const users = await User.find();
        return users;
    },

    async getUserById(id) {
        const user = await User.findById({ _id: id });
        return user;
    },

    async getUsersRecommend(user) {
        const following = await Following.find({ user: user });

        const followingUserIds = following.map((follow) => follow.following);
        followingUserIds.push(user);

        const users = await User.find({ _id: { $nin: followingUserIds } }).limit(3);

        let listUserRecommend = [];

        await Promise.all(
            users.map(async (user) => {
                const followerOfUserRecommend = await Follower.countDocuments({ user: user });
                listUserRecommend.push({ user, followerOfUserRecommend });
            })
        );

        return listUserRecommend;
    },

    async createUser(user) {
        try {
            user.password = await hashPassword(user.password);
            const userSchema = new User({
                _id: new mongoose.Types.ObjectId(),
                ...user,
            });
            const result = await userSchema.save();
            return result;
        } catch (error) {
            console.log(error);
        }
    },
};

export default UserService;
