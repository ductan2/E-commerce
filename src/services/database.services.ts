import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import User from "~/models/users.models";
import Products from "~/models/products.models";
import Blogs from "~/models/blogs.models";
import ProcCategorys from "~/models/procCategorys.models";
import BlogCategorys from "~/models/blogCategorys.models";
import Brands from "~/models/brand.models";
import Coupons from "~/models/coupons.models";
import { Carts } from "~/models/carts.models";
import { Order } from "~/models/order.models";
import { Colors } from "~/models/colors.models";
import { Contact } from "~/models/contact.models";
dotenv.config();

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hdfborf.mongodb.net/`;

// Database Name
const dbName = process.env.DB_NAME;

class DatabaseServices {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(url);
    this.db = this.client.db(dbName);
  }
  async connect() {
    try {
      await this.client.connect();
      console.log("Connected successfully to mongoDB");
    } catch (err) {
      console.log("Connect failed");
    }
  }
  get users(): Collection<User> {
    return this.db.collection("users")
  }
  get products(): Collection<Products> {
    return this.db.collection("products")
  }
  get blogs(): Collection<Blogs> {
    return this.db.collection("blogs")
  }
  get productCategorys(): Collection<ProcCategorys> {
    return this.db.collection("productCategorys")
  }
  get blogCategorys(): Collection<BlogCategorys> {
    return this.db.collection("blogCategorys")
  }
  get brands(): Collection<Brands> {
    return this.db.collection("brands")
  }
  get coupons(): Collection<Coupons> {
    return this.db.collection("coupons")
  }
  get carts(): Collection<Carts> {
    return this.db.collection("carts")
  }
  get order(): Collection<Order> {
    return this.db.collection("order")
  }
  get colors(): Collection<Colors> {
    return this.db.collection("colors")
  }
  get contact(): Collection<Contact> {
    return this.db.collection("contact")
  }
}

const databaseServices = new DatabaseServices();
export default databaseServices;
