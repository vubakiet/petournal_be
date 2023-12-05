import mongoose from "mongoose";
import Pet from "../models/base/Pet.js";
import ResponseModel from "../models/response/ResponseModel.js";
import Post from "../models/base/Post.js";

const PetService = {
    async getPets() {
        const pets = await Pet.find();
        return pets;
    },

    async getPetById(id) {
        const pet = await Pet.findById({ _id: id }).populate("user");
        return pet;
    },

    async getPetsByUserLogin(user) {
        const petsByUserLogin = await Pet.find({ user: user._id });
        return petsByUserLogin;
    },

    async getPetsByUserLoginPagination(user, body) {
        const page = body.page || 1;
        const limit = body.limit || 3;
        const skip = (page - 1) * limit;
        let petsByUserLogin;

        if (body.species) {
            petsByUserLogin = await Pet.find({ user: user._id, species: body.species })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
        } else {
            petsByUserLogin = await Pet.find({ user: user._id }).skip(skip).limit(limit).sort({ createdAt: -1 });
        }

        const countPets = await Pet.countDocuments({ user: user._id });
        const totalPages = Math.ceil(countPets / limit);

        return { petsByUserLogin, totalPages };
    },

    async getPetsByUserId(user_id) {
        const pets = await Pet.find({ user: user_id });

        return pets;
    },

    async createPet(user, pet) {
        try {
            const petSchema = new Pet({
                _id: new mongoose.Types.ObjectId(),
                user,
                ...pet,
            });
            const result = await petSchema.save();
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async updatePet(user, pet_id, body) {
        const pet = await Pet.findOne({ _id: pet_id, user });
        if (!pet) throw new ResponseModel(500, ["Không tồn tại pet"], null);

        const updatedPet = await Pet.findOneAndUpdate(
            { _id: pet_id, user },
            { $set: { ...body } },
            { new: true }
        ).populate("user");

        return updatedPet;
    },

    async removePet(id) {
        try {
            const result = await Pet.findByIdAndRemove(id);
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async getPostsPet(user, pet_id, body) {
        try {
            const page = body.page || 1;
            const limit = body.limit || 3;
            const skip = (page - 1) * limit;

            const posts = await Post.find({ pets: { $in: [pet_id] } })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const listPosts = posts.map((post) => ({
                ...post.toObject(),
            }));

            listPosts.map((post) => {
                const isLiked = post.likes.includes(user._id.toString());
                post.isLiked = isLiked;
            });

            return listPosts;
        } catch (error) {
            console.log(error);
        }
    },
};

export default PetService;
