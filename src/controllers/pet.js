import ResponseModel from "../models/response/ResponseModel.js";
import PetService from "../services/pet.js";

const PetController = {
    async getPets(req, res, next) {
        const result = await PetService.getPets();
        res.json(result);
    },

    async getPetById(req, res, next) {
        const result = await PetService.getPetById(req.user, req.params.id);
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

    async getPetsByUserLoginPagination(req, res, next) {
        try {
            const result = await PetService.getPetsByUserLoginPagination(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách pet của người dùng"], null));
        }
    },

    async getPetsByUserId(req, res, next) {
        try {
            const result = await PetService.getPetsByUserId(req.user, req.params.id);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách pet của người dùng"], null));
        }
    },

    async createPet(req, res, next) {
        try {
            const result = await PetService.createPet(req.user, req.body);
            if (result) {
                res.json(result);
            } else {
                return res.status(500).json(new ResponseModel(500, ["Lỗi tạo thú cưng"], null));
            }
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi tạo thú cưng"], null));
        }
    },

    async updatePet(req, res, next) {
        try {
            const result = await PetService.updatePet(req.user, req.params.id, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi sửa thú cưng"], null));
        }
    },

    async removePet(req, res, next) {
        const result = await PetService.removePet(req.params.id);
        res.json(result);
    },

    async getPostsPet(req, res, next) {
        try {
            const result = await PetService.getPostsPet(req.user, req.params.id, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách thú cưng"], null));
        }
    },
    async likePet(req, res, next) {
        try {
            const result = await PetService.likePet(req.user, req.params.id);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi theo dõi thú cưng"], null));
        }
    },
    async filterPet(req, res, next) {
        try {
            const result = await PetService.filterPet(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách thú cưng"], null));
        }
    },
};

export default PetController;
