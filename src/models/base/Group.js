import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const groupSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, require: true },
        describe: {type: String},
        members: Array,
        avatar: { type: String, require: true },
        posts: Array
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Group",
    }
);

export default mongoose.model("Group", groupSchema);
