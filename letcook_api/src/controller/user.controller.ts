import { NextFunction, Request, Response } from 'express';
import UserService from '@/service/user.service';

export default class UserController {
  private userService = new UserService();

  goToUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('goToUserProfile called');
      // Add any additional processing logic if needed
      res.sendStatus(200);
    } catch (error) {
      console.error('Error in goToUserProfile:', error);
      next(error);
    }
  };


  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();