import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import ReportController from "../controllers/report.js";

const route = Router();

route.post("/createReport", AuthMiddleware.verifyToken, ReportController.createReport);
route.get("/getReports", ReportController.getReports);

export default route;
