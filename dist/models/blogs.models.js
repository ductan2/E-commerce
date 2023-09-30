"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Blogs {
    constructor(blog) {
        this._id = blog._id || new mongodb_1.ObjectId();
        this.title = blog.title || "";
        this.description = blog.description || "";
        this.category = blog.category.map(item => new mongodb_1.ObjectId(item)) || [];
        this.numViews = blog.numViews || 0;
        this.isLiked = blog.isLiked || false;
        this.isDisliked = blog.isDisliked || false;
        this.likes = blog.likes || [];
        this.dislikes = blog.dislikes || [];
        this.images = blog.images || "https://img.freepik.com/free-vector/blogging-fun-content-creation-online-streaming-video-blog-young-girl-making-selfie-social-network-sharing-feedback-self-promotion-strategy-vector-isolated-concept-metaphor-illustration_335657-855.jpg?w=2000";
        this.author = blog.author || "Admin";
        this.craeted_at = blog.craeted_at || new Date();
        this.updated_at = blog.updated_at || new Date();
    }
}
exports.default = Blogs;
