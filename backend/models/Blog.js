const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    excerpt: String,
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    image: String, // URL to blog image
    metaDescription: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: Date,
    views: {
      type: Number,
      default: 0
    },
    category: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
