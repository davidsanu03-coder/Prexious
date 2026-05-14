import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function() {
  const user = this as any;
  if (!user.isModified("password")) return;
  user.password = await bcrypt.hash(user.password, 10);
});

export const User = mongoose.model("User", UserSchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sizes: [String],
  colors: [String],
  images: [String],
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", ProductSchema);

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  outfitType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  description: String,
  image: String,
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model("Booking", BookingSchema);

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    size: String,
    color: String,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  paymentReference: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", OrderSchema);

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, required: true },
  image: String,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.model("Review", ReviewSchema);

const GallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

export const Gallery = mongoose.model("Gallery", GallerySchema);

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "Prexious Vouge" },
  brandTitle: { type: String, default: "PREXIOUS VOUGE" },
  tagline: { type: String, default: "Luxury Fashion Heritage" },
  logo: String,
  favicon: String,
  heroTitle: { type: String, default: "THE PINNACLE OF HIGH-END FASHION" },
  heroSubtitle: { type: String, default: "Discover the exclusive collection where tradition meets modernity." },
  heroImage: { type: String, default: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" },
  whatsappNumber: { type: String, default: "2347045001991" },
  contactEmail: { type: String, default: "concierge@prexiousvouge.com" },
  address: { type: String, default: "Luxury Estate, Victoria Island, Lagos" },
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String
  },
  updatedAt: { type: Date, default: Date.now }
});

export const Settings = mongoose.model("Settings", SettingsSchema);

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  content: { type: String, required: true },
  image: String,
  rating: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

const PageContentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  content: String,
  image: String,
  updatedAt: { type: Date, default: Date.now }
});

export const PageContent = mongoose.model("PageContent", PageContentSchema);
