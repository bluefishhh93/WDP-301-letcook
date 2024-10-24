import { Router } from "express";
import UserController from "@/controller/user.controller";

const userController = new UserController();
const userRouter = Router();


userRouter.get("/user", userController.getUserById.bind(userController));
userRouter.put("/user", userController.updateUser.bind(userController));
userRouter.get("/user/:id", userController.getUserById.bind(userController));
userRouter.put("/user/:id", userController.updateUser.bind(userController));

userRouter.get("/users", userController.getListUser.bind(userController));
userRouter.get("/users/following/:id", userController.getListUserFollowed.bind(userController));
userRouter.put("/users/following/:id", userController.addFollowedUser.bind(userController));

export default userRouter;