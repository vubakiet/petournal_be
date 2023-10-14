import { Router } from "express";
import user from "./user.js";
import auth from "./auth.js";
import pet from "./pet.js"
import follow from "./follow.js"
import post from "./post.js"
import comment from "./comment.js"

const routes = Router();

routes.use("/user", user);
routes.use("/auth", auth);
routes.use("/pet", pet);
routes.use("/follow", follow);
routes.use("/post", post);
routes.use("/comment", comment);
routes.get("/", (req, res) => {
    res.send("Home");
});

export default routes;
