import express from "express";
import FollowController from "../controllers/follow.js";
import { AuthMiddleware } from "../middlewares/auth.js";

const route = express.Router();

route.get("/getFollowings", FollowController.getFollowings);

route.get("/getFollowingById/:id", FollowController.getFollowingById);

route.get("/getFollowers", FollowController.getFollowers);

route.get("/getFollowerById/:id", FollowController.getFollowerById);

route.post("/followUser/:id", AuthMiddleware.verifyToken, FollowController.followUser);

route.post("/getFollowingsByUser", AuthMiddleware.verifyToken, FollowController.getFollowingsByUser);

route.post("/getFollowersByUser", AuthMiddleware.verifyToken, FollowController.getFollowersByUser);

route.post("/unFollowUser/:id", FollowController.unFollowUser)

export default route;
