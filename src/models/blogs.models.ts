
import { ObjectId } from "mongodb"
import User from "./users.models"
import { UploadImageType } from "~/constants/type"



export interface BlogType {
  _id?: ObjectId
  title: string
  description: string
  category: ObjectId[]
  numViews: number
  isLiked: boolean
  isDisliked: boolean
  likes: string[] | User[] // refrerence to user
  dislikes: string[] | User[] // refrerence to user
  images: UploadImageType | string
  author: string
  craeted_at?: Date
  updated_at?: Date
}
export default class Blogs {
  _id?: ObjectId
  title: string
  description: string
  category: ObjectId[]
  numViews: number
  isLiked: boolean
  isDisliked: boolean
  likes: string[] | User[]// refrerence to user
  dislikes: string[] | User[] // refrerence to user
  images: UploadImageType | string
  author: string
  craeted_at?: Date
  updated_at?: Date
  constructor(blog: BlogType) {
    this._id = blog._id || new ObjectId()
    this.title = blog.title || ""
    this.description = blog.description || ""
    this.category = blog.category.map(item=>new ObjectId(item)) || []
    this.numViews = blog.numViews || 0
    this.isLiked = blog.isLiked || false
    this.isDisliked = blog.isDisliked || false
    this.likes = blog.likes || []
    this.dislikes = blog.dislikes || []
    this.images = blog.images || "https://img.freepik.com/free-vector/blogging-fun-content-creation-online-streaming-video-blog-young-girl-making-selfie-social-network-sharing-feedback-self-promotion-strategy-vector-isolated-concept-metaphor-illustration_335657-855.jpg?w=2000"
    this.author = blog.author || "Admin"
    this.craeted_at = blog.craeted_at || new Date()
    this.updated_at = blog.updated_at || new Date()
  }
}