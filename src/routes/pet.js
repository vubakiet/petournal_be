import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import PetController from "../controllers/pet.js";

const route = express.Router();

route.get("/getPets", PetController.getPets);

route.get("/getPetById/:id", AuthMiddleware.verifyToken, PetController.getPetById);

route.post("/getPetsByUserLogin", AuthMiddleware.verifyToken, PetController.getPetsByUserLogin);

route.post("/getPetsByUserLoginPagination", AuthMiddleware.verifyToken, PetController.getPetsByUserLoginPagination);

route.post("/createPet", AuthMiddleware.verifyToken, PetController.createPet);

route.post("/updatePet/:id", AuthMiddleware.verifyToken, PetController.updatePet);

route.post("/getPetsByUserId/:id", AuthMiddleware.verifyToken, PetController.getPetsByUserId);

route.post("/getPostsPet/:id", AuthMiddleware.verifyToken, PetController.getPostsPet);

route.post("/likePet/:id", AuthMiddleware.verifyToken, PetController.likePet);

route.post("/removePet/:id", PetController.removePet);

route.post("/filterPet", AuthMiddleware.verifyToken, PetController.filterPet);

export default route;
