import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const messageSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        users: Array,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String, require: true, trim: true },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Message",
    }
);

export default mongoose.model("Message", messageSchema);
