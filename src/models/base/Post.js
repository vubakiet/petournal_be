import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        imageUrl: { type: String },
        likes: Array,
        pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
        status: { type: Number, default: 1 },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Post",
    }
);

export default mongoose.model("Post", postSchema);
