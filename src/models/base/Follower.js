import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const followerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},    
},
{
    timestamps: true,
    versionKey: false,
    collection: 'Follower'
}
);

export default mongoose.model('Follower', followerSchema)