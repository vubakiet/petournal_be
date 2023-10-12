import express from "express";
import AuthController from "../controllers/auth.js";
import { AuthMiddleware } from "../middlewares/auth.js";

const route = express.Router();

route.post("/login", AuthController.login);

route.post("/logout", AuthMiddleware.verifyToken, AuthController.logout);

export default route;
