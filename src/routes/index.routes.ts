import express from "express"
import usersRouter from './users.routes';
import productsRouter from './products.routes';
import blogsRouter from './blogs.routes';
import productCategoysRouter from "./procCategorys.routes"
import blogCategorysRouter from "./blogCategory.routes"
import brandsRouter from "./brands.routes"
import couponsRouter from "./coupons.routes"
const router = express.Router();



router.use('/users', usersRouter)
router.use('/products', productsRouter)
router.use('/blogs', blogsRouter)
router.use('/procCategorys', productCategoysRouter)
router.use('/blogCategorys', blogCategorysRouter)
router.use('/brands', brandsRouter)
router.use('/coupons', couponsRouter)
export default router;