import ResponseModel from "../models/response/ResponseModel.js";
import PetService from "../services/pet.js";

const PetController = {
    async getPets(req, res, next) {
        const result = await PetService.getPets();
        res.json(result);
    },

    async getPetById(req, res, next) {
        const result = await PetService.getPetById(req.params.id);
        res.json(result);
    },

    async getPetsByUserLogin(req, res, next) {
        try {
            const result = await PetService.getPetsByUserLogin(req.user);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách pet của người dùng"], null));
        }
    },

    async createPet(req, res, next) {
        const result = await PetService.createPet(req.user, req.body);
        res.json(result);
    },

    async removePet(req, res, next) {
        const result = await PetService.removePet(req.params.id);
        res.json(result);
    },
};

export default PetController;
