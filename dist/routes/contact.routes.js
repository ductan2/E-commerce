"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const contact_middlewares_1 = require("../middlewares/contact.middlewares");
const validate_1 = require("../utils/validate");
const router = express_1.default.Router();
router.post("/", (0, validate_1.validate)(contact_middlewares_1.contactSchema), contact_controller_1.createContactController);
router.put("/:id", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, (0, validate_1.validate)(contact_middlewares_1.updateContactSchema), contact_controller_1.updateContactController);
router.delete("/:id", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, contact_controller_1.deleteContactController);
router.get("/get-all", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, contact_controller_1.getAllContactController);
router.get("/:id", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, contact_controller_1.getContactController);
exports.default = router;
