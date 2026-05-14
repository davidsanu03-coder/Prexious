import express from "express";
import axios from "axios";
import { authenticate } from "../middleware/auth.ts";
import { Order } from "../models/index.ts";

const router = express.Router();

router.post("/initialize", authenticate, async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;
    
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(amount * 100), // convert to kobo
        metadata,
        callback_url: `${process.env.APP_URL}/checkout/verify`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.response?.data?.message || "Payment initialization failed" });
  }
});

router.post("/verify", authenticate, async (req, res) => {
  try {
    const { reference, orderData } = req.body;
    
    // Check if transaction was successful
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    if (response.data.data.status === "success") {
      // Create order in DB
      const order = new Order({
        ...orderData,
        user: (req as any).user._id,
        paymentStatus: "paid",
        paymentReference: reference,
        status: "processing"
      });
      await order.save();
      res.json({ success: true, order });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Verification error" });
  }
});

export default router;
