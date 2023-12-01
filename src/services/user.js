import mongoose from "mongoose";
import User from "../models/base/User.js";
import { hashPassword } from "../utils/hashPassword.js";
import Following from "../models/base/Following.js";
import Follower from "../models/base/Follower.js";
import bcrypt from "bcrypt";
import ResponseModel from "../models/response/ResponseModel.js";
import AuthService from "./auth.js";
import { REFRESH_KEY, SECRECT_KEY } from "../config/index.js";
import { TIME_TOKEN } from "../common/constant/time-token.js";
import Pet from "../models/base/Pet.js";

const UserService = {
    async getUsers() {
        const users = await User.find();
        return users;
    },

    async getUserById(id) {
        const user = await User.findById({ _id: id });
        return user;
    },

    async getProfileUser(userLogin, user_id) {
        const user = await User.findById(user_id);

        if (!user) {
            throw new ResponseModel(500, ["Không tồn tại user"], null);
        }

        const petsOfUser = await Pet.countDocuments({ user: user });
        const followingsOfUser = await Following.countDocuments({ user: user });
        const followersOfUser = await Follower.countDocuments({ user: user });
        const isFollowing = await Following.exists({ user: userLogin, following: user });
        
        return { user, petsOfUser, followingsOfUser, followersOfUser, isFollowing: Boolean(isFollowing) };
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

    async changePassword(user, body) {
        const newPassword = await hashPassword(body.newPassword);
        const isValidPassword = await bcrypt.compare(body.password, user.password);
        if (isValidPassword) {
            const result = await User.findByIdAndUpdate(
                user._id.toString(),
                { $set: { password: newPassword } },
                { new: true }
            );

            const accessToken = AuthService.generateToken(result, SECRECT_KEY, TIME_TOKEN.ACCESS);
            const refreshToken = AuthService.generateToken(result, REFRESH_KEY, TIME_TOKEN.REFRESH);

            return new ResponseModel(200, [], { result, accessToken, refreshToken });
        } else {
            throw new ResponseModel(500, ["Sai mật khẩu"], null);
        }
    },

    async updateUser(user, body) {
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        if (body.email) {
            if (!isValidEmail(body.email)) {
                throw new ResponseModel(404, ["Invalid email"], null);
            }
        }
        const result = await User.findByIdAndUpdate(user._id.toString(), { $set: { ...body } }, { new: true });
        return result;
    },
};

export default UserService;
