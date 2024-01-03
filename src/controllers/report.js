import ResponseModel from "../models/response/ResponseModel.js";
import ReportService from "../services/report.js";

const ReportController = {
    async createReport(req, res, next) {
        try {
            const result = await ReportService.createReport(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Vui lòng chọn lý do"], null));
        }
    },

    async getReports(req, res, next) {
        const result = await ReportService.getReports();
        res.json(result);
    },

    async getPostsReported(req, res, next) {
        const result = await ReportService.getPostsReported();
        res.json(result);
    },

    async getUsersReported(req, res, next) {
        const result = await ReportService.getUsersReported();
        res.json(result);
    },
    async getReportDetails(req, res, next) {
        const result = await ReportService.getReportDetails(req.params.id);
        res.json(result);
    },
};

export default ReportController;
