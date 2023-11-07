"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authMiddlewares = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_services_1 = __importDefault(require("../services/database.services"));
const mongodb_1 = require("mongodb");
const authMiddlewares = async (req, res, next) => {
    let token;
    if (req?.headers?.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const expNow = Date.now() / 1000;
            const { exp } = decoded;
            if (Number(exp) < expNow)
                return res.status(401).json({ message: "Token has expired", status: 401 });
            const { id } = decoded;
            const user = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(id) });
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ message: "Token is invalid", status: 401 });
        }
    }
    else {
        return res.status(401).json({ message: "Token is invalid", status: 401 });
    }
};
exports.authMiddlewares = authMiddlewares;
const isAdmin = async (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to access!", status: 403 });
    }
    next();
};
exports.isAdmin = isAdmin;
