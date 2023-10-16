import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    parent_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', require: true},
    text: {type: String, require: true, trim: true},
},
{
    timestamps: true,
    versionKey: false,
    collection: 'Comment'
}
)

export default mongoose.model('Comment', commentSchema);