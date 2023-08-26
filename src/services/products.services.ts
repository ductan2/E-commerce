import Products, { ProductType } from "~/models/products.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import slug from "slug"
class ProductServices {
  async createProduct(payload: ProductType) {
    const _id = new ObjectId();
    await databaseServices.products.insertOne(new Products({
      _id,
      ...payload,
    }))
  }
  async getProduct(id: string) {
    return await databaseServices.products.findOne({ _id: new ObjectId(id) })
  }
  async getAllProducts(queryObj: any) {
    let filterQuery: any = {
      title: { $regex: new RegExp(queryObj.title || "", "i") },
      brand: { $regex: new RegExp(queryObj.brand || "", "i") },
      category: { $regex: new RegExp(queryObj.category || "", "i") },
    };
    if (queryObj.minPrice && queryObj.maxPrice) {
      filterQuery.price = {
        $gte: Number(queryObj.minPrice),
        $lte: Number(queryObj.maxPrice)
      };
    }
    let querySort = {};
    if (queryObj.sort) {
      querySort = queryObj.sort.split(",").join(" ");
    }
    const page = Number(queryObj.page) || 1;
    const limit = Number(queryObj.limit) || 10;
    const skip = (page - 1) * limit;


    return await databaseServices.products.find(filterQuery).sort(querySort).limit(limit).skip(skip).toArray();

  }
  async updateProduct(id: string, payload: ProductType) {
    const product = await databaseServices.products.findOne({ _id: new ObjectId(id) })

    return await databaseServices.products.findOneAndUpdate({ _id: new ObjectId(id) }, {
      $set: {
        ...payload, updated_at: new Date(), slug: slug(payload.title || product?.title as string, { lower: true })
      }
    }, { returnDocument: "after" })
  }
}

//notice slug
export const productServices = new ProductServices()