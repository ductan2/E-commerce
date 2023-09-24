import express from "express"
import { addToWishListController, createProductController, deleteImageController, deleteProductController, getAllOrdersController, getAllProductController, getCountProductsController, getProductController, ratingController, updateProductController, uploadImageController } from "~/controllers/products.controller";
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares";
import { filterMiddleware } from "~/middlewares/filter.middlewares";
import { ProductsValidator, RatingValidator, UpdateProductValidator, WishListValidator } from "~/middlewares/products.middlewares";
import { ProductType } from "~/models/products.models";
import { validate } from "~/utils/validate";
const router = express.Router();

router.get('/get-all-orders', authMiddlewares, isAdmin, getAllOrdersController)

router.put('/upload/:id', authMiddlewares, isAdmin, uploadImageController)

router.delete('/delete-image/:id', authMiddlewares, isAdmin, deleteImageController)

router.post('/', validate(ProductsValidator), createProductController)

router.get("/get-all-products", getAllProductController)

router.get('/count',getCountProductsController)

router.get('/:id', getProductController)


router.patch('/:id', validate(UpdateProductValidator), filterMiddleware<ProductType>(["brand", "category", "color", "trending", "featured",
  "price", "description", "images", "quantity", "ratings", "slug", "sold", "title"]), updateProductController)

router.delete('/:id', deleteProductController)

router.put('/add-to-wishlist', authMiddlewares, validate(WishListValidator), addToWishListController)


router.put('/rating', authMiddlewares, validate(RatingValidator), ratingController)



export default router

