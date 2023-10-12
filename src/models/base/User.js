import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        },
        password: { type: String, required: true },
        role: { type: String, required: true, trim: true },
        avatar: { type: String },
        bio: {type: String},
        birthday: { type: Date },
        gender: {type: Boolean},
        phone: { type: String, required: true, trim: true, unique: true },
        address: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'User'
    },
);

export default mongoose.model('User', userSchema);

