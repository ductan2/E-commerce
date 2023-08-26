import express from "express"
import { createProductController, deleteProductController, getAllProductController, getProductController, updateProductController } from "~/controllers/products.controller";
import { ProductsValidator, UpdateProductValidator } from "~/middlewares/products.middlewares";
import { validate } from "~/utils/validate";
const router = express.Router();


router.post('/',validate(ProductsValidator),createProductController)

router.get('/:id',getProductController)

router.patch('/:id',validate(UpdateProductValidator),updateProductController)

router.delete('/:id',deleteProductController)

router.get("/get-all-products", getAllProductController)
export default router

