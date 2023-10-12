import mongoose from "mongoose";
import User from "../models/base/User.js";
import { hashPassword } from "../utils/hashPassword.js";

const UserService = {

    async getUsers() {
        const users = await User.find();
        return users;
    },

    async getUserById(id){
        const user = await User.findById({ _id: id });
        return user;
    },

    async createUser(user) {
        try {
            user.password = await hashPassword(user.password);
            const userSchema = new User({
                _id: new mongoose.Types.ObjectId(),
                ...user,
            });
            const result = await userSchema.save();
            return result;    
        } catch (error) {
            console.log(error)
        }
        
    }
}

export default UserService;