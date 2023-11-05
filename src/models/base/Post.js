import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        imagesUrl: { type: String },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true }],
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Post",
    }
);

export default mongoose.model("Post", postSchema);
