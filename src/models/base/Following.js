import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const followingSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},    
},
{
    timestamps: true,
    versionKey: false,
    collection: 'Following'
}
);

export default mongoose.model('Following', followingSchema)