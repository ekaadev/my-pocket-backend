import express from 'express';
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import contactController from "../controller/contact-controller.js";
import addressController from "../controller/address-controller.js";

// router for public api
const userRouter = new express.Router();

// handler: user-controller
userRouter.use(authMiddleware);
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// handler: contact-controller
userRouter.post("/api/contacts", contactController.create);
userRouter.get("/api/contacts/:contactId", contactController.get);
userRouter.put("/api/contacts/:contactId", contactController.update);
userRouter.delete("/api/contacts/:contactId", contactController.remove);
userRouter.get("/api/contacts", contactController.search);

// handler: address-controller
userRouter.post("/api/contacts/:contactId/addresses", addressController.create);
userRouter.get("/api/contacts/:contactId/addresses/:addressId", addressController.get);
userRouter.put("/api/contacts/:contactId/addresses/:addressId", addressController.update);
userRouter.delete("/api/contacts/:contactId/addresses/:addressId", addressController.remove);
userRouter.get("/api/contacts/:contactId/addresses", addressController.list);

export {
    userRouter
};