import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import PetController from "../controllers/pet.js";

const route = express.Router();

route.get("/getPets", PetController.getPets);

route.get("/getPetById/:id", PetController.getPetById);

route.post("/createPet", AuthMiddleware.verifyToken, PetController.createPet);

route.post("/removePet/:id", PetController.removePet)

export default route;
