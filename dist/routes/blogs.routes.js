"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogs_controller_1 = require("../controllers/blogs.controller");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const blogs_middlewares_1 = require("../middlewares/blogs.middlewares");
const filter_middlewares_1 = require("../middlewares/filter.middlewares");
const validate_1 = require("../utils/validate");
const router = express_1.default.Router();
router.post("/", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, (0, validate_1.validate)(blogs_middlewares_1.BlogValidator), blogs_controller_1.createBlogController);
router.get("/get-all", blogs_controller_1.getAllBlogsController);
router.put("/likes", auth_middlewares_1.authMiddlewares, blogs_controller_1.likesBlogController);
router.put('/dislikes', auth_middlewares_1.authMiddlewares, blogs_controller_1.disLikesBlogController);
router.put('/upload/:id', auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, blogs_controller_1.uploadImageController);
router.delete('/delete-image/:id', auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, blogs_controller_1.deleteImageController);
router.get("/:id", blogs_controller_1.getBlogController);
router.patch("/:id", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, (0, validate_1.validate)(blogs_middlewares_1.UpdateBlogValidator), (0, filter_middlewares_1.filterMiddleware)(["author", "category", "description", "title", "numViews", "images"]), blogs_controller_1.updateBlogController);
router.delete("/:id", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, blogs_controller_1.deleteBlogController);
exports.default = router;
