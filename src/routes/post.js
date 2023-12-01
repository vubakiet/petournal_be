import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import PostController from "../controllers/post.js";

const route = express.Router();

route.get("/getPosts", PostController.getPosts);

route.get("/getPostById/:id", PostController.getPostById);

route.post("/createPost", AuthMiddleware.verifyToken, PostController.createPost);

route.post("/updatePost/:id", AuthMiddleware.verifyToken, PostController.updatePost);

route.post("/deletePost/:id", AuthMiddleware.verifyToken, PostController.deletePost);

route.post("/likePost/:id", AuthMiddleware.verifyToken, PostController.likePost);

export default route;
