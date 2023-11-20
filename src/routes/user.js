import { Router } from "express";
import UserController from "../controllers/user.js";
import { AuthMiddleware } from "../middlewares/auth.js";

const route = Router();

route.get("/getUsers", UserController.getUsers);

route.get("/getUserById/:id", UserController.getUserById);

route.get("/getUsersRecommend", AuthMiddleware.verifyToken, UserController.getUsersRecommend);

route.post("/create", UserController.createUser);

export default route;
