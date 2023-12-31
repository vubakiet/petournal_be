import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const notificationSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        type: { type: String, require: true },
        userSend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userReceive: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
        pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
        text: { type: String, require: true },
        isRead: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Notification",
    }
);

export default mongoose.model("Notification", notificationSchema);
