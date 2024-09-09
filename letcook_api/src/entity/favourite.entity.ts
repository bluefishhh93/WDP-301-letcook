import { Entity, ObjectIdColumn, Column, ObjectId, CreateDateColumn, BaseEntity } from "typeorm";
@Entity()
export class Favorite extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  recipeId!: string;
}   