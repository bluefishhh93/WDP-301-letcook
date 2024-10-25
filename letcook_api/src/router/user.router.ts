import { Router } from "express";
import UserController from "@/controller/user.controller";
import { verifyToken } from "@/middleware/authJwt";

const userController = new UserController();
const userRouter = Router();


userRouter.get("/user",verifyToken ,userController.getUserById.bind(userController));
userRouter.put("/user",verifyToken , userController.updateUser.bind(userController));
userRouter.get("/user/:id",verifyToken , userController.getUserById.bind(userController));
// userRouter.put("/user/:id",verifyToken , userController.updateUser.bind(userController));

userRouter.get("/users", userController.getListUser.bind(userController));
userRouter.get("/users/following/:id", userController.getListUserFollowed.bind(userController));
userRouter.put("/users/following/:id", userController.addFollowedUser.bind(userController));

export default userRouter;