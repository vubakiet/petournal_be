import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const connectionSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        socket_id: {type: String, require: true},
    }, 
    {
        timestamps: true,
        versionKey: false,
        collection: "Connection"
    }
)

export default mongoose.model("Connection",  connectionSchema);