import mongoose from "mongoose";
import Report from "../models/base/Report.js";

const ReportService = {
    async createReport(user, body) {
        try {
            const reportSchema = new Report({
                _id: new mongoose.Types.ObjectId(),
                reporter: user,
                ...body,
            });
            const result = await reportSchema.save();
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async getReports() {
        const reports = await Report.find().populate("user").populate("post");

        return reports;
    },
};

export default ReportService;
