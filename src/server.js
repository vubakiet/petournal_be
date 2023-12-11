import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import { DB_LINK, NEXT_APP_CLIENT, PORT } from "./config/index.js";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import Gateway from "./socket/gateway.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"], // Your client's address
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"], // Make sure Authorization header is allowed
        credentials: true,
    },
});

global._io = io;

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
    var allowedDomains = [NEXT_APP_CLIENT, "http://localhost:3001"];
    app.use(
        cors({
            origin: function (origin, callback) {
                // bypass the requests with no origin (like curl requests, mobile apps, etc )
                if (!origin) return callback(null, true);

                if (allowedDomains.indexOf(origin) === -1) {
                    var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            credentials: true,
        })
    );

    app.use(cookieParser());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(express.json());

    app.use(morgan("combined"));

    app.use("/api/v1", routes);

    /** Healthcheck */
    app.get("/ping", (req, res, next) => res.status(200).json({ hello: "world" }));

    /** Error handling */
    // app.use((req, res, next) => {
    //     const error = new Error("Not found");

    //     console.error(error);

    //     res.status(404).json({
    //         message: error.message,
    //     });
    // });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    });

    global._io.on("connection", Gateway.connection);

    server.listen(PORT, () => console.info(`Server is running on port ${PORT}`));
};
