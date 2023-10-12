import { Router } from "express";
import UserController from "../controllers/user.js";

const route = Router();

route.get('/getUsers', UserController.getUsers);
route.get('/getUserById/:id', UserController.getUserById);
route.post('/create', UserController.createUser)

export default route;