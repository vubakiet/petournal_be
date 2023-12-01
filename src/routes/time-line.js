import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import TimeLineController from "../controllers/time-line.js";

const route = Router();

route.post("/getTimeLine", AuthMiddleware.verifyToken, TimeLineController.getTimeLine);
route.get("/getTimeLineDetail/:id", TimeLineController.getTimeLineDetail);
route.post("/getTimeLineByUserId/:id", AuthMiddleware.verifyToken, TimeLineController.getTimeLineByUserId);

export default route;
