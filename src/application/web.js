import express from "express";
import {publicRouter} from "../route/public-api.js";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {userRouter} from "../route/api.js";

// init express
export const web = express();

// use json
web.use(express.json());
// use public router
web.use(publicRouter);
// use user router
web.use(userRouter);

web.use(errorMiddleware);