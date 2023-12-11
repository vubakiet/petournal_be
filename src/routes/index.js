import { Router } from "express";
import user from "./user.js";
import auth from "./auth.js";
import pet from "./pet.js";
import follow from "./follow.js";
import post from "./post.js";
import comment from "./comment.js";
import notification from "./notification.js";
import timeLine from "./time-line.js";
import conversation from "./conversation.js";
import message from "./message.js";
import group from "./group.js";
import report from "./report.js";

const routes = Router();

routes.use("/user", user);
routes.use("/auth", auth);
routes.use("/pet", pet);
routes.use("/follow", follow);
routes.use("/post", post);
routes.use("/comment", comment);
routes.use("/notification", notification);
routes.use("/timeLine", timeLine);
routes.use("/conversation", conversation);
routes.use("/message", message);
routes.use("/group", group);
routes.use("/report", report);
routes.get("/", (req, res) => {
    res.send("Home");
});

export default routes;
