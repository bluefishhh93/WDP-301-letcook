import authRouter from "@/router/auth.router";
import categoryProductRouter from "@/router/categoryProduct.router";
import commentRouter from "@/router/comment.router";
import measurementRouter from "@/router/measurement.router";
import postRouter from "@/router/post.router";
import productRouter from "@/router/product.router";
import uploadRouter from "@/router/upload.router";
import recipeRouter from "@/router/recipe.router";
import orderRouter from "@/router/order.router";
import ImageUploadRouter from "@/router/imageUpload";
import notificationRouter from "@/router/notification.router";
import vnpayRouter from "@/router/vnpay.router";
import reviewRouter from "@/router/review.router";
import dashboardRouter from "@/router/dashboard.router";
import favoriteRouter from "@/router/favourite.router";
import path from "path";
import userRouter from "./user.router";
export default [
  { path: "/api/auth", router: authRouter },
  { path: "/api", router: postRouter },
  { path: "/api", router: commentRouter },
  { path: "/api", router: recipeRouter },
  { path: "/api", router: productRouter },
  { path: "/api", router: measurementRouter },
  { path: "/api", router: categoryProductRouter },
  { path: "/api", router: orderRouter },
  { path: "/api", router: uploadRouter },
  { path: "/api", router: ImageUploadRouter },
  { path: "/api", router: notificationRouter },
  { path: "/api", router: vnpayRouter },
  { path: "/api", router: reviewRouter },
  { path: "/api", router: dashboardRouter },
  { path: "/api", router: favoriteRouter },
  { path: "/api", router: userRouter },
];
