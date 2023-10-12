import AuthService from "../services/auth.js";

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
};

export default AuthController;
