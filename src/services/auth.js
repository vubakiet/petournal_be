import { TIME_TOKEN } from "../common/constant/time-token.js";
import { REFRESH_KEY, SECRECT_KEY } from "../config/index.js";
import User from "../models/base/User.js";
import ResponseModel from "../models/response/ResponseModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/hashPassword.js";
import mongoose from "mongoose";
import { ROLE } from "../common/constant/role.js";

const AuthService = {
    async checkLogin(body, res) {
        const { email, password } = body;
        const user = await User.findOne({ email: email });
        if (user) {
            const isValidAccount = await bcrypt.compare(password, user.password);
            const ava = user.avatar;
            user.avatar = "";
            if (isValidAccount) {
                const refId = user._id.toString();

                const accessToken = AuthService.generateToken(user, SECRECT_KEY, TIME_TOKEN.ACCESS);
                const refreshToken = AuthService.generateToken(user, REFRESH_KEY, TIME_TOKEN.REFRESH);

                user.avatar = ava;

                return new ResponseModel(200, [], {
                    user,
                    accessToken,
                    refreshToken,
                    refId,
                });
            }

            return false;
        }
        return user;
    },

    async refeshToken(req, res) {
        let newAccessToken = "";
        let newRefreshToken = "";
        const refreshToken = req.cookies.refeshTokenPetournal;

        if (!refreshToken) {
            return res.status(401).json(new ResponseModel(401, ["Hết hạn phiên bản, vui lòng đăng nhập lại"], null));
        }

        jwt.verify(refreshToken, REFRESH_KEY, (err, { user }) => {
            if (err) {
                console.log("err", err);
            }
            newAccessToken = AuthService.generateToken(user, SECRECT_KEY, TIME_TOKEN.ACCESS);
            newRefreshToken = AuthService.generateToken(user, REFRESH_KEY, TIME_TOKEN.REFRESH);
        });

        return {
            newAccessToken,
            newRefreshToken,
        };
    },

    async register(registerBody) {
        try {
            registerBody.password = await hashPassword(registerBody.password);
            const userSchema = new User({
                _id: new mongoose.Types.ObjectId(),
                ...registerBody,
                role: ROLE.USER,
            });
            const result = await userSchema.save();

            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async updatePassword(body) {
        try {
            body.password = await hashPassword(body.password);

            const updateUser = await User.findOneAndUpdate(
                { email: body.email },
                { $set: { password: body.password } },
                { new: true }
            );

            return updateUser;
        } catch (error) {
            console.log(error);
        }
    },

    async checkExistEmail(email) {
        const messageError = [];
        const user = await User.findOne({
            email: email,
        });

        if (!user) {
            messageError.push("Email không tồn tại");
        }

        return messageError;
    },

    async generateTokenForResetPassword(email) {
        const token = await jwt.sign(
            {
                email: email,
            },
            SECRECT_KEY,
            {
                expiresIn: "5m",
            }
        );
        return token;
    },

    async logout(req, res) {
        res.clearCookie("refreshTokenPetournal");
        return new ResponseModel(200, ["logout success"]);
    },

    generateToken(data, key, timeString) {
        return jwt.sign({ user: data }, key, { expiresIn: timeString });
    },
};

export default AuthService;
