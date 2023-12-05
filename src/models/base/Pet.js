import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const petSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        species: { type: String, required: true },
        breed: { type: String },
        sex: { type: String },
        birthday: { type: Date },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        avatar: { type: String },
        bio: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Pet",
    }
);

export default mongoose.model("Pet", petSchema);
