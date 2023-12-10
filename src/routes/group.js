import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import GroupController from "../controllers/group.js";

const route = Router();

route.post("/createGroup", AuthMiddleware.verifyToken, GroupController.createGroup);

route.post("/getGroupsByUserLogin", AuthMiddleware.verifyToken, GroupController.getGroupsByUserLogin);

route.post("/getGroupsByOwner", AuthMiddleware.verifyToken, GroupController.getGroupsByOwner);

route.post("/getGroupById/:id", GroupController.getGroupById);

route.post("/getMembers", GroupController.getMembers);

route.post("/addPostToGroup", GroupController.addPostToGroup);

route.post("/getPostsFromGroup", AuthMiddleware.verifyToken, GroupController.getPostsFromGroup);

route.post("/getListUserInvite", AuthMiddleware.verifyToken, GroupController.getListUserInvite);

route.post("/updateProfileGroup", AuthMiddleware.verifyToken, GroupController.updateProfileGroup);

export default route;
