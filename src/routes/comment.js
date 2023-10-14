import express from "express"
import { AuthMiddleware } from "../middlewares/auth.js";
import CommentController from "../controllers/comment.js";

const route = express.Router();

route.post("/createComment/:id", AuthMiddleware.verifyToken, CommentController.createComment)

export default route;