import mongoose from "mongoose";
import Pet from "../models/base/Pet.js";

const PetService = {

    async getPets() {
        const pets = await Pet.find();
        return pets;
    },

    async getPetById(id){
        const pet = await Pet.findById({ _id: id });
        return pet;
    },

    async createPet(user, pet) {
        try {
            const petSchema = new Pet({
                _id: new mongoose.Types.ObjectId(),
                user,
                ...pet
            });
            const result = await petSchema.save();
            return result;
        } catch (error) {
            console.log(error)
        }
    },

    async removePet(id){
        try {
            const result = await Pet.findByIdAndRemove(id);
            return result;
        } catch (error) {
            console.log(error)
        }
    }
}

export default PetService;