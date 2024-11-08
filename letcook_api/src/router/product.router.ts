import { Router } from "express";
import validateRequest from "@/util/validateRequest";
import ProductController from '../controller/product.controller';
import { resolveIndexId } from "@/middleware";
import { verifyToken, checkRole } from '@/middleware/authJwt';
import { UserRole } from '@/@types/user.d';

const router = Router();
const productController = new ProductController();

// Public routes
router.get("/products", productController.getAllDTO.bind(productController));
router.get("/shop/products", productController.getProducts.bind(productController));
router.get("/products/search", validateRequest, productController.findAndPaginate.bind(productController));
router.get("/products/:id", resolveIndexId, productController.getSingle.bind(productController));
router.get("/products/findByCategoryId/:id", resolveIndexId, productController.findByCategoryId.bind(productController));

// Admin-only routes
router.post("/products", verifyToken, checkRole([UserRole.ADMIN]), validateRequest, productController.createDTO.bind(productController));
router.put("/products/:id", verifyToken, checkRole([UserRole.ADMIN]), validateRequest, productController.update.bind(productController));
router.delete("/products/:id", verifyToken, checkRole([UserRole.ADMIN]), productController.delete.bind(productController));

export default router;