import mongoose from "mongoose"

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId(),
    content: {type: String},
    imagesUrl: [
        {type: String}
    ],
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    pets: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Pet'}
    ],
},
{
    timestamps: true,
    versionKey: false,
    collection: 'Post'
}
);

export default mongoose.model('Post', postSchema);

