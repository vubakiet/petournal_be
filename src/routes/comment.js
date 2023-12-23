import express from "express"
import { AuthMiddleware } from "../middlewares/auth.js";
import CommentController from "../controllers/comment.js";

const route = express.Router();

route.post("/createComment", AuthMiddleware.verifyToken, CommentController.createComment);

route.post("/getComments", CommentController.getComments);

route.post("/getTotalCommentCount", CommentController.getTotalCommentCount);

route.post("/getCommentsChild", CommentController.getCommentsChild);

route.post("/updateComment", AuthMiddleware.verifyToken, CommentController.updateComment);

route.post("/deleteComment/:id", AuthMiddleware.verifyToken, CommentController.deleteComment);

export default route;