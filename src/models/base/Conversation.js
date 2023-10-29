import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const conversationSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        users: Array,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String, require: true, trim: true },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Conversation",
    }
);

export default mongoose.model("Conversation", conversationSchema);
