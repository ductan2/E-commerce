"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = __importDefault(require("./users.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
const blogs_routes_1 = __importDefault(require("./blogs.routes"));
const procCategorys_routes_1 = __importDefault(require("./procCategorys.routes"));
const blogCategory_routes_1 = __importDefault(require("./blogCategory.routes"));
const brands_routes_1 = __importDefault(require("./brands.routes"));
const coupons_routes_1 = __importDefault(require("./coupons.routes"));
const colors_routes_1 = __importDefault(require("./colors.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const payment_routes_1 = __importDefault(require("./payment.routes"));
const router = express_1.default.Router();
router.use('/users', users_routes_1.default);
router.use('/products', products_routes_1.default);
router.use('/blogs', blogs_routes_1.default);
router.use('/product-categorys', procCategorys_routes_1.default);
router.use('/blog-categorys', blogCategory_routes_1.default);
router.use('/brands', brands_routes_1.default);
router.use('/coupons', coupons_routes_1.default);
router.use("/colors", colors_routes_1.default);
router.use("/payment", payment_routes_1.default);
router.use("/contact", contact_routes_1.default);
router.use('/uploads', upload_routes_1.default);
exports.default = router;
