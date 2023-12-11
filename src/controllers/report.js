import ReportService from "../services/report.js";

const ReportController = {
    async createReport(req, res, next) {
        const result = await ReportService.createReport(req.user, req.body);
        res.json(result);
    },

    async getReports(req, res, next) {
        const result = await ReportService.getReports();
        res.json(result);
    },
};

export default ReportController;
