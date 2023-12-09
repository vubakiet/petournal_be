import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const petSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        species: { type: String, required: true },
        breed: { type: String, required: true },
        sex: { type: String, required: true },
        birthday: { type: Date },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        avatar: { type: String, required: true },
        bio: { type: String, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Pet",
    }
);

export default mongoose.model("Pet", petSchema);
