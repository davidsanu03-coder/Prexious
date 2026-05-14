import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import { Product, Booking, Review, Gallery, Settings, Order, Testimonial, PageContent } from "../models/index.ts";
import { authenticate, adminOnly } from "../middleware/auth.ts";
import { upload } from "../lib/cloudinary.ts";

const router = express.Router();

// SETTINGS
router.get("/settings", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("Database not connected, returning default settings");
      return res.json({
        siteName: "Prexious Vouge",
        brandTitle: "PREXIOUS VOUGE",
        tagline: "Luxury Fashion Heritage",
        heroTitle: "THE PINNACLE OF HIGH-END FASHION",
        heroSubtitle: "Discover the exclusive collection where tradition meets modernity.",
        heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
        whatsappNumber: "2347045001991",
        contactEmail: "concierge@prexiousvouge.com",
        address: "Luxury Estate, Victoria Island, Lagos",
        socialLinks: {}
      });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error("GET /settings error:", error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// PAYSTACK VERIFICATION
router.post("/payment/verify", authenticate, async (req: any, res) => {
  try {
    const { reference, address, items, amount } = req.body;
    
    // Verify with Paystack
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    if (response.data.data.status === "success") {
      const order = new Order({
        user: req.user._id,
        items: items.map((i: any) => ({
          product: i.id,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
          price: i.price
        })),
        totalAmount: amount,
        address,
        paymentStatus: "paid",
        paymentReference: reference
      });
      await order.save();
      res.json({ message: "Payment verified and order created", order });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/settings", authenticate, adminOnly, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }, { name: 'heroImage', maxCount: 1 }]), async (req: any, res) => {
  try {
    const update = { ...req.body };
    if (req.files?.logo) update.logo = req.files.logo[0].path;
    if (req.files?.favicon) update.favicon = req.files.favicon[0].path;
    if (req.files?.heroImage) update.heroImage = req.files.heroImage[0].path;
    
    if (update.socialLinks && typeof update.socialLinks === 'string') {
      try {
        update.socialLinks = JSON.parse(update.socialLinks);
      } catch (e) {
        // Fallback or ignore
      }
    }

    const settings = await Settings.findOneAndUpdate({}, update, { upsert: true, new: true });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PRODUCTS
router.get("/products", async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query: any = {};
    if (category) query.category = category;
    if (featured) query.isFeatured = true;
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/products", authenticate, adminOnly, upload.array("images", 5), async (req: any, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock, isFeatured } = req.body;
    const images = (req.files as any[])?.map(f => f.path) || [];
    
    const product = new Product({
      name, description, price, category, 
      sizes: JSON.parse(sizes || "[]"), 
      colors: JSON.parse(colors || "[]"), 
      stock, isFeatured, images
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// BOOKINGS
router.post("/bookings", upload.single("image"), async (req: any, res) => {
  try {
    const { name, email, phone, outfitType, eventDate, description } = req.body;
    const image = (req.file as any)?.path;
    const booking = new Booking({ name, email, phone, outfitType, eventDate, description, image });
    await booking.save();
    res.json({ message: "Booking submitted successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Booking Management
router.get("/admin/bookings", authenticate, adminOnly, async (req: any, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// REVIEWS
router.get("/reviews/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/reviews", authenticate, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/admin/reviews/:id/approve", authenticate, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/reviews/:id", authenticate, adminOnly, async (req, res) => {
    try {
      await Review.findByIdAndDelete(req.params.id);
      res.json({ message: "Review deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

router.post("/reviews", authenticate, upload.single("image"), async (req: any, res) => {
  try {
    const { product, rating, comment } = req.body;
    const image = (req.file as any)?.path;
    const review = new Review({ user: (req as any).user._id, product, rating, comment, image });
    await review.save();
    res.json({ message: "Review submitted for approval", review });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GALLERY
router.get("/gallery", async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/admin/gallery", authenticate, adminOnly, upload.single("image"), async (req: any, res) => {
  try {
    const { caption, category } = req.body;
    const image = (req.file as any)?.path;
    const item = new Gallery({ image, caption, category });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/gallery/:id", authenticate, adminOnly, async (req: any, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// TESTIMONIALS
router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/admin/testimonials", authenticate, adminOnly, upload.single("image"), async (req: any, res) => {
  try {
    const { name, role, content, rating } = req.body;
    const image = (req.file as any)?.path;
    const testimonial = new Testimonial({ name, role, content, rating, image });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/testimonials/:id", authenticate, adminOnly, async (req: any, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PAGE CONTENT
router.get("/pages/:slug", async (req, res) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/admin/pages/:slug", authenticate, adminOnly, upload.single("image"), async (req: any, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = req.file.path;
    const page = await PageContent.findOneAndUpdate({ slug: req.params.slug }, update, { upsert: true, new: true });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
