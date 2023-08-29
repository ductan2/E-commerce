import express from "express"
import { addToWishListController, createProductController, deleteProductController, getAllProductController, getProductController, ratingController, updateProductController } from "~/controllers/products.controller";
import { authMiddlewares } from "~/middlewares/auth.middlewares";
import { filterMiddleware } from "~/middlewares/filter.middlewares";
import { ProductsValidator, RatingValidator, UpdateProductValidator, WishListValidator } from "~/middlewares/products.middlewares";
import { ProductType } from "~/models/products.models";
import { validate } from "~/utils/validate";
const router = express.Router();


router.post('/', validate(ProductsValidator), createProductController)

router.get("/get-all-products", getAllProductController)

router.get('/:id', getProductController)

router.patch('/:id', validate(UpdateProductValidator), filterMiddleware<ProductType>(["brand", "category", "color", "description", "images", "price", "quantity", "ratings", "slug", "sold", "title"]), updateProductController)

router.delete('/:id', deleteProductController)

router.put('/add-to-wishlist', authMiddlewares, validate(WishListValidator), addToWishListController)

router.put('/rating',authMiddlewares,validate(RatingValidator),ratingController)


export default router

