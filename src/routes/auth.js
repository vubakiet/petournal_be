import express from "express";
import AuthController from "../controllers/auth.js";
import { AuthMiddleware } from "../middlewares/auth.js";

const route = express.Router();

route.post("/login", AuthController.login);

route.post("/logout", AuthMiddleware.verifyToken, AuthController.logout);

route.post("/register", AuthController.register);

route.post("/updatePassword", AuthController.updatePassword);

route.post("/sendMailResetPassword", AuthController.sendMailResetPassword);

route.post("/refresh-token", AuthController.refreshToken);

export default route;
