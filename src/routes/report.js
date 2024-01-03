import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import ReportController from "../controllers/report.js";
import { ROLE } from "../common/constant/role.js";

const route = Router();

route.post("/createReport", AuthMiddleware.verifyToken, ReportController.createReport);

route.get("/getReports", AuthMiddleware.authorize(ROLE.ADMIN), ReportController.getReports);

route.get("/getPostsReported", AuthMiddleware.authorize(ROLE.ADMIN), ReportController.getPostsReported);

route.get("/getUsersReported", AuthMiddleware.authorize(ROLE.ADMIN), ReportController.getUsersReported);

route.get("/getReportDetails/:id", AuthMiddleware.authorize(ROLE.ADMIN), ReportController.getReportDetails);

export default route;
