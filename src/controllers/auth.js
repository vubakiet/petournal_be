import AuthService from "../services/auth.js";
import { MessageVN } from "../common/constant/message-vn.js";
import ResponseModel from "../models/response/ResponseModel.js";
import MailService from "../services/mail.js";

const AuthController = {
    async login(req, res, next) {
        const response = await AuthService.checkLogin(req.body, res);
        if (response) {
            res.cookie("refreshTokenPetournal", response.result.refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            delete response.result.refreshToken;
            res.json(response);
        } else {
            res.status(403).json(new ResponseModel(500, ["Email hoặc mật khẩu không đúng !!"], null));
        }
    },

    async logout(req, res, next) {
        try {
            const result = await AuthService.logout(req, res);
            res.json(result);
        } catch (e) {
            res.status(500).json(new ResponseModel(500, [MessageVN.ERROR_500], null));
        }
    },

    async register(req, res, next) {
        try {
            const response = await AuthService.register(req.body);
            res.json(response);
        } catch (error) {
            res.status(500).json(new ResponseModel(500, [MessageVN.ERROR_500], null));
        }
    },

    async updatePassword(req, res, next) {
        try {
            const response = await AuthService.updatePassword(req.body);
            res.json(response);
        } catch (error) {
            res.status(500).json(new ResponseModel(500, [MessageVN.ERROR_500], null));
        }
    },

    async sendMailResetPassword(req, res, next) {
        try {
            const { email } = req.body;
            const messageError = await AuthService.checkExistEmail(email);
            console.log(messageError);

            if (messageError.length === 0) {
                const tokenForResetPassword = await AuthService.generateTokenForResetPassword(email);
                if (tokenForResetPassword) {
                    const response = await MailService.sendMailVerifyResetPassword(email, tokenForResetPassword);

                    res.json(response);
                }
            } else {
                res.status(500).json(new ResponseModel(500, messageError, null));
            }
        } catch (error) {
            res.status(500).json(new ResponseModel(500, [MessageVN.ERROR_500], null));
        }
    },

    async refreshToken(req, res, next) {
        try {
            const response = await AuthService.refeshToken(req, res);
            if (response) {
                res.cookie("refreshTokenPetournal", response.newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                delete response.newRefreshToken;
                res.json(new ResponseModel(200, ["get token success"], response));
            } else {
                res.json(new ResponseModel(500, ["Vui lòng đăng nhập lại"], null));
            }
        } catch (error) {
            res.status(500).json(new ResponseModel(500, [MessageVN.ERROR_500], null));
        }
    },
};

export default AuthController;
