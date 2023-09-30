import Products, { ProductType } from "~/models/products.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import slug from "slug"
import User from "~/models/users.models";
import { getFileName, handleuploadImage } from "~/utils/file";
import fs from "fs";
import path from 'path';
import sharp from 'sharp';
import { File } from 'formidable';
import { UPLOAD_IMAGE_PRODUCT_DIR, UPLOAD_IMAGE_PRODUCT_TEMP_DIR } from "~/constants/dir";
import { Request } from "express";
import { cloudinaryUploadImage } from "~/utils/cloudinary";
import { ProductQuery } from "~/constants/type";
import { ProductAggregation } from "~/models/aggregation.models";
class ProductServices {
  async createProduct(payload: ProductType) {
    const _id = new ObjectId();

    await databaseServices.brands.updateOne({ _id: new ObjectId(payload.brand as string) }, {
      $inc: {
        quantity: 1
      }
    })

    await databaseServices.products.insertOne(new Products({
      _id,
      ...payload,
      slug: slug(payload.title as string || payload.slug as string, { lower: true })
    }))
    return databaseServices.products.findOne({ _id })
  }
  async getProduct(id: string) {
    const aggregation = new ProductAggregation();
    const result = await aggregation
      .matchById(id)
      .lookupColor()
      .addColorField()
      .lookupCategory()
      .addCategoryField()
      .addBrandInfo()
      .execute(databaseServices.products);

    return result;
  }
  async getColors(colors: { color: string }[]) {
    const ids = colors.map((item) => new ObjectId(item.color))
    return await databaseServices.colors.find({ _id: { $in: ids } }).toArray()
  }
  async getAllProducts(queryObj: ProductQuery) {
    let brandId: ObjectId | undefined;
    if (queryObj.brand) {
      const brandName = await databaseServices.brands.findOne({ title: RegExp(queryObj.brand || "", "i") })
      brandId = brandName?._id;
    }
    const aggregation = new ProductAggregation();
    const result = await aggregation
      .matchObject(queryObj, brandId)
      .lookupColor()
      .addColorField()
      .lookupCategory()
      .addCategoryField()
      .addBrandInfo()
      .sortObject(queryObj.sort ? { [queryObj.sort]: queryObj.sort === 'desc' ? -1 : 1 } : { created_at: 1 })
      .skip(queryObj.page && queryObj.page > 0 ? (queryObj.page - 1) * (queryObj.limit || 10) : 0)
      .limit(queryObj.limit ? Number(queryObj.limit) : 10)
      .execute(databaseServices.products);
    const totalItem = await this.getCountProducts(queryObj)
    return {
      total: totalItem.total,
      data: result,
    };
  }

  async updateProduct(id: string, payload: ProductType) {
    const product = await databaseServices.products.findOne({ _id: new ObjectId(id) })
    if (payload.brand) {
      payload.brand = new ObjectId(payload.brand);
    }
    if (payload.category) {
      payload.category = payload.category.map((item) => new ObjectId(item));
    }
    if (payload.color) {
      payload.color = payload.color.map((item) => new ObjectId(item));
    }
    return await databaseServices.products.findOneAndUpdate({ _id: new ObjectId(id) }, {
      $set: {
        ...payload, updated_at: new Date(), slug: slug(payload.title || product?.title as string, { lower: true })
      }
    }, { returnDocument: "after" })
  }
  async deleteProduct(id: string) {
    await databaseServices.products.deleteOne({ _id: new ObjectId(id) })
  }
  async addToWishList(product_id: string, user: User) {
    const alreadyAdded = user.wishlist?.find((item) => item.toString() === product_id)
    if (alreadyAdded) {
      return await databaseServices.users.findOneAndUpdate({ _id: new ObjectId(user._id) }, {
        $pull: {
          wishlist: product_id
        }
      }, { returnDocument: "after" })
    }
    else {
      return await databaseServices.users.findOneAndUpdate({ _id: new ObjectId(user._id) }, {
        $push: {
          wishlist: product_id
        }
      }, { returnDocument: "after" })
    }
  }
  async rating(product_id: string, user_id: string, star: number, comment: string) {
    const product = await databaseServices.products.findOne({ _id: new ObjectId(product_id) })
    const existingRating = product?.ratings?.find((item) => item.postedBy.toString() === user_id.toString())
    if (existingRating) {
      await databaseServices.products.findOneAndUpdate(
        {
          ratings: { $elemMatch: existingRating } // $elemMatch: Matches documents that contain an array field with at least one element that matches all the specified query criteria.
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment } // $ is the first position of the element in the array that matches the query condition.
        }, { returnDocument: "after" })
    }
    else {
      await databaseServices.products.findOneAndUpdate({ _id: new ObjectId(product_id) }, {
        $push: {
          ratings: {
            star,
            comment,
            postedBy: user_id
          }
        }
      }, { returnDocument: "after" })

    }
    // caculator rating
    const productAllRating = await databaseServices.products.findOne({ _id: new ObjectId(product_id) })
    const lengthRatingProc = productAllRating?.ratings?.length
    const sumRating = productAllRating?.ratings?.reduce((prev, item) => prev + item.star, 0)
    return await databaseServices.products.findOneAndUpdate({ _id: new ObjectId(product_id) }, {
      $set: {
        rating_distribution: Math.round(Number(sumRating) / Number(lengthRatingProc))
      }
    })
  }
  async uploadImage(req: Request) {
    const files = await handleuploadImage(req, UPLOAD_IMAGE_PRODUCT_TEMP_DIR) as any;

    const urls: any[] = []
    await Promise.all(files.map(async (file: File) => {

      const fileName = getFileName(file)
      const newPath = path.resolve(UPLOAD_IMAGE_PRODUCT_DIR, `${fileName}`)
      await sharp(file.filepath).jpeg().toFile(newPath)
      fs.unlink(file.filepath, (err) => {
        console.log(err)
      })
      urls.push(await cloudinaryUploadImage(newPath))
    }))

    return await databaseServices.products.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, {
      $push: {
        images: { $each: urls }
      }
    }, { returnDocument: "after" })
  }
  async getAllOrders(search: string) {

    //6511672d1109dcb621f83d44
    const piper = [
      {
        $match: {

        }
      },
      {
        $lookup: {
          from: "users",
          localField: "orderby",
          foreignField: "_id",
          as: "orderby",
        },
      },
      {
        $unwind: "$orderby",
      },
      {
        $addFields: {
          orderby: "$orderby.email",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "products.product",
        },
      },
      {
        $unwind: "$products.product",
      },
      {
        $addFields: {
          "products.product.color": "$products.color",
        },
      },
      {
        $lookup: {
          from: "colors",
          localField: "products.color",
          foreignField: "_id",
          as: "products.color",
        },
      },
      {
        $addFields: {
          "products.product.color": {
            $arrayElemAt: [
              "$products.color.title",
              0,
            ],
          },
        },
      },
      {
        $project: {
          "products.color": 0,
        },
      },
    ]
    if (search) {
      piper.push({
        $match: {
          order_status: search
        }
      });
    }

    const result = await databaseServices.order.aggregate(piper).toArray()


    return result;
  }
  async getCountProducts(queryObj: ProductQuery) {
    let brandId: ObjectId | undefined;
    if (queryObj.brand) {
      const brandName = await databaseServices.brands.findOne({ title: RegExp(queryObj.brand || "", "i") })
      brandId = brandName?._id;
    }

    const pipeline = [
      {
        $match: {
          $and: [
            queryObj.title ? { title: { $regex: new RegExp(queryObj.title, 'i') } } : {},
            queryObj.brand ? { brand: brandId } : {},
            { price: { $gte: queryObj.minPrice || 0, $lte: queryObj.maxPrice || Number.MAX_VALUE } },
          ],
        },
      },
      {
        $count: "total",
      },
    ];

    const result = await databaseServices.products.aggregate(pipeline).toArray();
    if (result.length > 0) {
      return { total: result[0].total };
    } else {
      return { total: 0 }; // Trường hợp không có sản phẩm nào thỏa mãn điều kiện tìm kiếm
    }
  }
}

//notice slug
export const productServices = new ProductServices()