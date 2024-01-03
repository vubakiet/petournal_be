import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const reportSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        reasons: Array,
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Report",
    }
);

export default mongoose.model("Report", reportSchema);
