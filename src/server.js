import express from "express";
import http from "http";
import cookiePaser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import { DB_LINK, PORT } from "./config/index.js";
import routes from "./routes/index.js";

const app = express();

mongoose
    .connect(DB_LINK)
    .then(() => {
        console.info("Mongodb is connected");
        startServrver();
    })
    .catch((error) => {
        console.error(`Unable to connect: ${error}`);
    });

const startServrver = () => {
    app.use(cookiePaser());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(express.json());

    app.use(morgan("combined"));

    app.use('/api/v1', routes)

    /** Healthcheck */
    app.get("/ping", (req, res, next) => res.status(200).json({ hello: "world" }));

    /** Error handling */
    app.use((req, res, next) => {
        const error = new Error("Not found");

        console.error(error);

        res.status(404).json({
            message: error.message,
        });
    });

    http.createServer(app).listen(PORT, () => console.info(`Server is running on port ${PORT}`));
};
