import { Router } from "express";
import UserController from "../controllers/user.js";
import { AuthMiddleware } from "../middlewares/auth.js";
import { ROLE } from "../common/constant/role.js";

const route = Router();

route.get("/getUsers", AuthMiddleware.authorize(ROLE.ADMIN), UserController.getUsers);

route.get("/getUserById/:id", UserController.getUserById);

route.get("/getProfileUser/:id", AuthMiddleware.verifyToken, UserController.getProfileUser);

route.get("/getUsersRecommend", AuthMiddleware.verifyToken, UserController.getUsersRecommend);

route.post("/create", UserController.createUser);

route.post("/changePassword", AuthMiddleware.verifyToken, UserController.changePassword);

route.post("/updateUser", AuthMiddleware.verifyToken, UserController.updateUser);

route.post("/filterUser", UserController.filterUser);

route.post("/changeStatusUser", AuthMiddleware.authorize(ROLE.ADMIN), UserController.changeStatusUser);

export default route;
