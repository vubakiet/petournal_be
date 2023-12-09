import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const conversationSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        users: Array
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Conversation",
    }
);

export default mongoose.model("Conversation", conversationSchema);
