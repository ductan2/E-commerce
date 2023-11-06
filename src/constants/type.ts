import { ObjectId, WithId } from "mongodb";
import { type } from "os";
import { ProductType } from "~/models/products.models";
import { Address } from "~/models/users.models";

export type EmailData = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export type ProductOrder = {
  product: WithId<ProductType>;
  color: string;
  count: number;
  price?: number | undefined;
}
export interface ProductQuery {
  title?: string | RegExp;
  brand?: string | RegExp;
  category?: string | RegExp;
  trending?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}
export type UploadImageType = {
  url: string
  asset_id: string
  public_id: string
}


export interface RegisterRequestBody {
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  password: string;
}
export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ErrorType {
  message: string;
  status: number;
  path?: string
}
export interface UpdateReqeustBody {
  firstname: string;
  lastname: string;
  mobile: string;
}
export interface UpdateInfo {
  firstname: string;
  lastname: string
  mobile: string
  address: Address
  avatar: UploadImageType
}

export interface RatingType {
  star: number
  comment: string
  postedBy: string
  posted_at: Date
}
export interface imageUrl {
  url: string
}
// CLASS
export class ErrorWithStatus {
  message: string
  status: number
  path?: string
  constructor({ message, status, path }: ErrorType) {
    this.message = message
    this.status = status
    this.path = path
  }
}
