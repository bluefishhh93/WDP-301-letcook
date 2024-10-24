import { UserRole } from '@/@types/user.d';
import { RefreshToken } from '@/entity/refreshToken.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('text')
  id?: string;

  @Column('text')
  username?: string;

  @Column('text', { nullable: true })
  email?: string;

  @Column('text', { nullable: true })
  bio?: string;

  @Column('text', { nullable: true })
  phone?: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column('text', { nullable: true })
  avatar?: string;

  @Column('text', { nullable: true, unique: true })
  refreshTokenId?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole;

  @OneToOne(() => RefreshToken)
  @JoinColumn({ name: 'refreshTokenId' })
  refreshTokenEntity?: RefreshToken;

  // Quan hệ nhiều-nhiều với chính User để lưu danh sách người dùng đã follow
  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({
    name: 'user_followers', // Tên bảng trung gian để lưu quan hệ follow
    joinColumn: {
      name: 'userId', // Cột lưu id của người dùng hiện tại
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'followedUserId', // Cột lưu id của người dùng được follow
      referencedColumnName: 'id',
    },
  })
  followedUsers?: User[];

  // Danh sách người dùng đã follow mình
  @ManyToMany(() => User, (user) => user.followedUsers)
  followers?: User[];
}
