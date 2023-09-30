"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const crypto_1 = __importDefault(require("crypto"));
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
})(Role || (Role = {}));
class User {
    constructor(user) {
        const date = new Date();
        this._id = user._id || new mongodb_1.ObjectId();
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.email = user.email;
        this.mobile = user.mobile;
        this.password = user.password;
        this.role = user.role || Role.USER;
        this.avatar = user.avatar || "https://anubis.gr/wp-content/uploads/2018/03/no-avatar.png";
        this.blocked = user.blocked || false;
        this.address = user.address || "";
        this.refresh_token = user.refresh_token || "";
        this.password_reset_token = user.password_reset_token || "";
        this.wishlist = user.wishlist || [];
        this.password_reset_expires = user.password_reset_expires || undefined;
        this.created_at = user.created_at || date;
        this.updated_at = user.updated_at || date;
    }
    async createPasswordResetToken() {
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const password_reset_token = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        const password_reset_expires = new Date(Date.now() + 10 * 60 * 1000);
        return {
            password_reset_token,
            password_reset_expires,
            resetToken
        };
    }
}
exports.default = User;
