import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import PetController from "../controllers/pet.js";

const route = express.Router();

route.get("/getPets", PetController.getPets);

route.get("/getPetById/:id", PetController.getPetById);

route.post("/getPetsByUserLogin", AuthMiddleware.verifyToken, PetController.getPetsByUserLogin);

route.post("/getPetsByUserLoginPagination", AuthMiddleware.verifyToken, PetController.getPetsByUserLoginPagination);

route.post("/createPet", AuthMiddleware.verifyToken, PetController.createPet);

route.post("/updatePet/:id", AuthMiddleware.verifyToken, PetController.updatePet);

route.post("/getPetsByUserId/:id", PetController.getPetsByUserId);

route.post("/getPostsPet/:id", AuthMiddleware.verifyToken, PetController.getPostsPet);

route.post("/removePet/:id", PetController.removePet);

export default route;
