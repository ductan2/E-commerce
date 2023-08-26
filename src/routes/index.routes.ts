import express from "express"
import usersRouter from './users.routes';
import productsRouter from './products.routes';
const router = express.Router();


router.use('/users', usersRouter)
router.use('/products', productsRouter)
export default router;