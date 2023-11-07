"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const blogCategorys_controller_1 = require("../controllers/blogCategorys.controller");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const database_services_1 = __importDefault(require("../services/database.services"));
const validate_1 = require("../utils/validate");
const router = express_1.default.Router();
const blogCategorySchema = (0, express_validator_1.checkSchema)({
    title: {
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 50,
            },
            errorMessage: "Title must be at least 2 characters long and less than 50 characters long."
        },
        custom: {
            options: async (value, { req }) => {
                const isUnique = await database_services_1.default.blogCategorys.findOne({ title: value });
                if (isUnique) {
                    throw new Error("Title is already in use");
                }
            }
        }
    }
}, ["body"]);
router.post("/", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, (0, validate_1.validate)(blogCategorySchema), blogCategorys_controller_1.createBlogCategoryController);
router.put("/:id", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, (0, validate_1.validate)(blogCategorySchema), blogCategorys_controller_1.updateBlogCategoryController);
router.delete("/:id", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, blogCategorys_controller_1.deleteBlogCategoryController);
router.get("/get-all", blogCategorys_controller_1.getAllBlogCategoryController);
router.get("/:id", blogCategorys_controller_1.getBlogCategoryController);
exports.default = router;
