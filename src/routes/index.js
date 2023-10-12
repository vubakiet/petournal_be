import { Router } from "express";
import user from "./user.js";
import auth from "./auth.js";
import pet from "./pet.js"
import follow from "./follow.js"

const routes = Router();

routes.use("/user", user);
routes.use("/auth", auth);
routes.use("/pet", pet);
routes.use("/follow", follow);
routes.get("/", (req, res) => {
    res.send("Home");
});

export default routes;
