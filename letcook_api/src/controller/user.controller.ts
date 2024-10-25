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
      const {id} = req.user as {id: string};
      const user = await this.userService.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.user as {id: string};
      const user = await this.userService.findUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  getListUserFollowed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id; // ID của người dùng mà chúng ta cần lấy danh sách người đã theo dõi
      const followedUsers = await this.userService.getListUserFollowed(userId);
      res.status(200).json(followedUsers);
    } catch (error) {
      console.error('Error in getListUserFollowed:', error);
      next(error);
    }
  };
  
  

  addFollowedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id; // ID của người dùng hiện tại (người thực hiện follow)
      const followedUserId = req.body.followedUserId; // ID của người dùng muốn theo dõi (nhận từ request body)

      // Gọi hàm trong UserService để thực hiện thêm người dùng vào danh sách followedUsers
      const updatedUser = await this.userService.addFollowedUser(userId, followedUserId);

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error in addFollowedUser:', error);
      next(error);
    }
  };
    // Hàm getListUser mới thêm
    getListUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const users = await this.userService.getAllUsers();  // Gọi hàm từ service để lấy danh sách người dùng
        res.json(users);
      } catch (error) {
        console.error('Error in getListUser:', error);
        next(error);
      }
    };

    getListUserFollowers = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.params.id; // ID of the user whose followers we want to get
        const followers = await this.userService.getListUserFollowers(userId);
        res.status(200).json(followers);
      } catch (error) {
        console.error('Error in getListUserFollowers:', error);
        next(error);
      }
    };
}


export const userController = new UserController();
