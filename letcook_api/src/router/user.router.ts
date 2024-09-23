import { Router } from "express";
import UserController from "@/controller/user.controller";

const userController = new UserController();
const userRouter = Router();

userRouter.get("/user/:id", userController.getUserById.bind(userController));
userRouter.put("/user/:id", userController.updateUser.bind(userController));


export default userRouter;