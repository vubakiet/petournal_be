import mongoose from "mongoose";
import Report from "../models/base/Report.js";

const ReportService = {
    async createReport(user, body) {
        console.log(body);
        try {
            if (body.reasons.length <= 0) {
                throw new Error("Vui lòng chọn lý do");
            }
            const reportSchema = new Report({
                _id: new mongoose.Types.ObjectId(),
                reporter: user,
                ...body,
            });
            const result = await reportSchema.save();
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async getReports() {
        const reports = await Report.find().populate("user").populate("post");
        const existsPostReport = reports.some((report) => report.type === "POST");
        const existsUserReport = reports.some((report) => report.type === "USER");
        return { reports, existsPostReport, existsUserReport };
    },

    async getPostsReported() {
        const posts = await Report.find({ type: "POST" }).populate("post").populate("reporter");
        return posts;
    },

    async getUsersReported() {
        const users = await Report.find({ type: "USER" }).populate("user").populate("reporter");
        return users;
    },

    async getReportDetails(id) {
        const report = await Report.findById(id).populate("user").populate("post").populate("reporter");
        return report;
    },
};

export default ReportService;
