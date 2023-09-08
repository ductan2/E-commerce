import { ObjectId } from "mongodb"
import crypto from "crypto"
enum Role {
  USER = "user",
  ADMIN = "admin"
}
export interface UserType {
  _id?: ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  password: string;
  role?: Role
  address?: string;
  blocked?: boolean
  cart?: any[]
  wishlist?: string[] // href of product
  avatar?: string
  refresh_token?: string
  password_reset_token?: string
  password_reset_expires?: Date
  created_at?: Date
  updated_at?: Date
}


export default class User {
  _id: ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  password: string;
  role: Role;
  address?: string;
  blocked?: boolean
  wishlist?: string[]
  avatar?: string
  refresh_token?: string
  password_reset_token?: string
  password_reset_expires?: Date
  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    const date = new Date();
    this._id = user._id || new ObjectId();
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.mobile = user.mobile;
    this.password = user.password;
    this.role = user.role || Role.USER
    this.avatar = user.avatar || "https://anubis.gr/wp-content/uploads/2018/03/no-avatar.png"
    this.blocked = user.blocked || false
    this.address = user.address || ""
    this.refresh_token = user.refresh_token || ""
    this.password_reset_token = user.password_reset_token || ""
    this.wishlist = user.wishlist || []
    this.password_reset_expires = user.password_reset_expires || undefined
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
  async createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const password_reset_token = crypto.createHash("sha256").update(resetToken).digest("hex");
    const password_reset_expires = new Date(Date.now() + 10 * 60 * 1000);
    return {
      password_reset_token,
      password_reset_expires,
      resetToken
    };
  }
}



