import { CategoryProduct } from "@/entity/categoryProduct.entity";
import { Comment } from "@/entity/comment.entity";
import { Product } from "@/entity/product.entity";
import { Measurement } from "@/entity/measurement.entity";
import { Notification } from "@/entity/notification.entity";
import { Nutrition } from "@/entity/nutrition.entity";
import { Order } from "@/entity/order.entity";
import { OrderItem } from "@/entity/orderItem.entity";
import { Post } from "@/entity/post.entity";
import {
  Recipe,
  RecipeComment,
  RecipeReaction,
  RecipeTag,
} from "@/entity/recipe.entity";
import { RefreshToken } from "@/entity/refreshToken.entity";
import { User } from "@/entity/user.entity";
import { ImgProduct } from "@/entity/imgProduct.entity";
import env from "@/util/validateEnv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Review } from "@/entity/review.entity";
import { ImgReview } from "@/entity/imgReview.entity";
import { Step } from "@/entity/recipeStep.entity.ts";
import { Ingredient } from "@/entity/ingredient.entity.ts";
import { Favorite } from "@/entity/favourite.entity";

// import { Notification } from '@/entity/notification.entity';
// import { Post } from '@/entity/post.entity';
// import env from '@/util/validateEnv';
const MongoDataSource = new DataSource({
  type: "mongodb",
  url: `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_HOST}/${env.MONGO_DB}?retryWrites=true&w=majority`,

  // host: env.MONGO_HOST,
  // port: env.MONGO_PORT,
  // database: env.MONGO_DB,
  // username: env.MONGO_USER,
  // password: env.MONGO_PASS,
  
  // useUnifiedTopology: true,
  // useNewUrlParser: true,

  synchronize: false,
  logging: false,
  // entities: [__dirname + '/entity/*.ts'],
  entities: [
    Notification,
    RecipeTag,
    Post,
    Comment,
    Recipe,
    Step,
    Ingredient,
    RecipeComment,
    RecipeReaction,
    Favorite
  ],
  migrations: [],
  subscribers: [],
  maxQueryExecutionTime: 2000, // thời gian tối đa mà một câu query được thực thi
});

const PostgresDataSource = new DataSource({
  type: "postgres",
  url: env.POSTGRES_EXTERNAL_URL,
  // ssl: {
  //   rejectUnauthorized: false, // This is important if you don't have a custom CA
  // },
  synchronize: true,
  logging: false,
  entities: [
    User,
    RefreshToken,
    CategoryProduct,
    Product,
    Nutrition,
    Measurement,
    // Recipe,
    ImgProduct,
    Order,
    OrderItem,
    Review,
    ImgReview,
  ],
  migrations: [],
  subscribers: [],
  maxQueryExecutionTime: 2000,
});

export { MongoDataSource, PostgresDataSource };
