"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hdfborf.mongodb.net/`;
// Database Name
const dbName = process.env.DB_NAME;
class DatabaseServices {
    constructor() {
        this.client = new mongodb_1.MongoClient(url);
        this.db = this.client.db(dbName);
    }
    async connect() {
        try {
            await this.client.connect();
            console.log("Connected successfully to mongoDB");
        }
        catch (err) {
            console.log("Connect failed");
        }
    }
    get users() {
        return this.db.collection("users");
    }
    get products() {
        return this.db.collection("products");
    }
    get blogs() {
        return this.db.collection("blogs");
    }
    get productCategorys() {
        return this.db.collection("productCategorys");
    }
    get blogCategorys() {
        return this.db.collection("blogCategorys");
    }
    get brands() {
        return this.db.collection("brands");
    }
    get coupons() {
        return this.db.collection("coupons");
    }
    get carts() {
        return this.db.collection("carts");
    }
    get order() {
        return this.db.collection("order");
    }
    get colors() {
        return this.db.collection("colors");
    }
    get contact() {
        return this.db.collection("contact");
    }
}
const databaseServices = new DatabaseServices();
exports.default = databaseServices;
