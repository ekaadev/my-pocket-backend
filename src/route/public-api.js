import express from 'express';
import userController from "../controller/user-controller.js";

// router for public api
const publicRouter = new express.Router();

// handler: user-controller
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);
export {
    publicRouter
};