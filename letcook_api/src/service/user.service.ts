import { PostgresDataSource } from '@/config/db.config';
import { RefreshToken } from '@/entity/refreshToken.entity';
import { User } from '@/entity/user.entity';
import { generateAccessToken, generateRefreshToken } from "@/util/tokenGenerate";
import handleError from '@/util/handleError';

class UserService {
  private userRepository = PostgresDataSource.getRepository(User);
  private refreshTokenRepository = PostgresDataSource.getRepository(User);
  //save user
  async saveUser(user: User) {
    return await this.userRepository.save(user);
  }

  //find user by id
  async findUserById(id: string) {
    // console.log('sss', id);
    return await this.userRepository.findOneBy({ id: id });
  }

  async findRefreshTokenByUserId(userId: string): Promise<RefreshToken | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return await this.refreshTokenRepository.findOneBy({
      id: user?.refreshTokenId,
    });
  }

  async findUserByRefreshToken(refreshToken: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ refreshTokenId: refreshToken });
  }

  async countUsers() {
    return await this.userRepository.count();
  }

  async updateUser(userId: string, user: Partial<User>) {
    return await this.userRepository.update(userId, user);
  }

  // Lấy tất cả người dùng
  async getAllUsers() {
    return await this.userRepository.find();  // Truy vấn tất cả người dùng
  }

  async getListUserFollowed(userId: string): Promise<User[]> {
    // Sử dụng repository đã khởi tạo
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedUsers'], // Lấy thông tin người dùng đã theo dõi
    });

    return user?.followedUsers || []; // Trả về danh sách người dùng đã theo dõi hoặc mảng rỗng
  }

  async addFollowedUser(userId: string, followedUserId: string): Promise<User | null> {
    try {
      // Tìm người dùng hiện tại
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['followedUsers'], // Đảm bảo quan hệ được load
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Tìm người dùng muốn theo dõi
      const followedUser = await this.userRepository.findOne({
        where: { id: followedUserId },
      });

      if (!followedUser) {
        throw new Error('Followed user not found');
      }

      // Kiểm tra nếu người dùng này chưa được theo dõi thì thêm vào danh sách
      if (!user.followedUsers?.some((user) => user.id === followedUserId)) {
        user.followedUsers = [...(user.followedUsers || []), followedUser];
      }

      // Lưu lại thông tin người dùng
      await this.userRepository.save(user);
      console.log('Received userId:', userId);
console.log('Received followedUserId:', followedUserId);

      return user;
    } catch (error) {
      handleError(error as Error, 'Error adding followed user');
      return null;
    }
  }


  //get all user who follow user

}

export default UserService;
