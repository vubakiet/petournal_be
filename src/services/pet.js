import mongoose from "mongoose";
import Pet from "../models/base/Pet.js";
import ResponseModel from "../models/response/ResponseModel.js";
import Post from "../models/base/Post.js";

const PetService = {
    async getPets() {
        const pets = await Pet.find();
        return pets;
    },

    async getPetById(user, id) {
        const result = await Pet.findById({ _id: id }).populate("user");

        const isLiked = result.likes.includes(user._id.toString());
        let pet = {
            ...result.toObject(),
            isLiked: isLiked,
        };
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
        let listPet;
        let countPets;

        if (body.species == "all") {
            listPet = await Pet.find({ user: user._id }).skip(skip).limit(limit).sort({ createdAt: -1 });
            countPets = await Pet.countDocuments({ user: user._id });
        }

        if (body.species && body.species !== "all") {
            listPet = await Pet.find({ user: user._id, species: body.species })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            countPets = await Pet.countDocuments({ user: user._id, species: body.species });
        } else {
            listPet = await Pet.find({ user: user._id }).skip(skip).limit(limit).sort({ createdAt: -1 });
            countPets = await Pet.countDocuments({ user: user._id });
        }

        let petsByUserLogin = await Promise.all(
            listPet.map((pet) => {
                const isLiked = pet.likes.includes(user._id);

                return {
                    ...pet.toObject(),
                    isLiked: isLiked,
                };
            })
        );

        const totalPages = Math.ceil(countPets / limit);

        return { petsByUserLogin, totalPages };
    },

    async getPetsByUserId(user, user_id) {
        const pets = await Pet.find({ user: user_id });

        let listPet = pets.map((pet) => {
            const isLiked = pet.likes.includes(user._id.toString());

            return {
                ...pet.toObject(),
                isLiked: isLiked,
            };
        });

        return listPet;
    },

    async createPet(user, pet) {
        try {
            const { name, species, breed, sex, birthday, avatar, bio } = pet;

            if (!name || !species || !breed || !sex || !birthday || !avatar || !bio) {
                throw new ResponseModel(500, ["Tạo thú cưng thất bại"], null);
            }

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

            const posts = await Post.find({ pets: { $in: [pet_id] }, status: 1 })
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

    async likePet(user, pet_id) {
        const pet = await Pet.findById(pet_id);
        if (!pet) throw new ResponseModel(500, ["Không tìm thấy pet"], null);

        const likedByUser = pet.likes.includes(user._id.toString());

        let petUpdate;

        if (likedByUser) {
            petUpdate = await Pet.findOneAndUpdate(
                { _id: pet._id },
                { $pull: { likes: user._id.toString() } },
                { new: true }
            );
        } else {
            petUpdate = await Pet.findOneAndUpdate(
                { _id: pet._id },
                { $push: { likes: user._id.toString() } },
                { new: true }
            );
        }

        const isLiked = petUpdate.likes.includes(user._id.toString());

        let result = {
            ...petUpdate.toObject(),
            isLiked,
        };

        return result;
    },
    async filterPet(user, body) {
        try {
            const { keyword } = body;
            const userId = user._id.toString();

            // Split the keyword into an array of individual words
            const keywordsArray = keyword.split(/\s+/).filter(Boolean);

            // Build an array of conditions for each keyword
            const conditions = keywordsArray.map((kw) => ({
                $or: [
                    { name: { $regex: kw, $options: "i" } },
                    { breed: { $regex: kw, $options: "i" } },
                    { species: { $regex: kw, $options: "i" } },
                ],
            }));

            // Combine conditions with $and to match all keywords
            const pets = await Pet.find({ $and: conditions.length > 0 ? conditions : [{}], user: userId });

            return pets;
        } catch (error) {
            console.error("Error filtering pets:", error);
            throw error; // Handle the error appropriately in your application
        }
    },
};

export default PetService;
