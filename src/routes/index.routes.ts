import express from "express"
import usersRouter from './users.routes';
import productsRouter from './products.routes';
import blogsRouter from './blogs.routes';
import productCategoysRouter from "./procCategorys.routes"
import blogCategorysRouter from "./blogCategory.routes"
import brandsRouter from "./brands.routes"
import couponsRouter from "./coupons.routes"
import colorsRouter from "./colors.routes"
import contactRouter from "./contact.routes"
const router = express.Router();



router.use('/users', usersRouter)
router.use('/products', productsRouter)
router.use('/blogs', blogsRouter)
router.use('/procduct-categorys', productCategoysRouter)
router.use('/blog-categorys', blogCategorysRouter)
router.use('/brands', brandsRouter)
router.use('/coupons', couponsRouter)
router.use("/colors", colorsRouter)
router.use("/contact", contactRouter)
export default router;