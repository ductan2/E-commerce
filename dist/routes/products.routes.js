"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("../controllers/products.controller");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const filter_middlewares_1 = require("../middlewares/filter.middlewares");
const products_middlewares_1 = require("../middlewares/products.middlewares");
const validate_1 = require("../utils/validate");
const router = express_1.default.Router();
router.get('/get-all-orders', auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, products_controller_1.getAllOrdersController);
router.put('/upload/:id', auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, products_controller_1.uploadImageController);
router.delete('/delete-image/:id', auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, products_controller_1.deleteImageController);
router.post('/', (0, validate_1.validate)(products_middlewares_1.ProductsValidator), products_controller_1.createProductController);
router.get("/get-all-products", products_controller_1.getAllProductController);
router.get('/count', products_controller_1.getCountProductsController);
router.get('/:id', products_controller_1.getProductController);
router.patch('/:id', (0, validate_1.validate)(products_middlewares_1.UpdateProductValidator), (0, filter_middlewares_1.filterMiddleware)(["brand", "category", "color", "trending", "featured",
    "price", "description", "images", "quantity", "ratings", "slug", "sold", "title"]), products_controller_1.updateProductController);
router.delete('/:id', products_controller_1.deleteProductController);
router.put('/add-to-wishlist', auth_middlewares_1.authMiddlewares, (0, validate_1.validate)(products_middlewares_1.WishListValidator), products_controller_1.addToWishListController);
router.put('/rating', auth_middlewares_1.authMiddlewares, (0, validate_1.validate)(products_middlewares_1.RatingValidator), products_controller_1.ratingController);
exports.default = router;
