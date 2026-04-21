const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protect } = require("../middleware/authMiddleware");

router.post("/upi/intent", protect, async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount)
      return res.status(400).json({ message: "Amount is required" });

    const upiId = process.env.MERCHANT_UPI_ID || "merchant@upi";
    const merchantName = encodeURIComponent(
      process.env.MERCHANT_NAME || "Monrclair Luxury",
    );
    const orderRef = `MC_${Date.now()}_${req.user.id}`;

    const upiUri = `upi://pay?pa=${upiId}&pn=${merchantName}&tr=${orderRef}&am=${totalAmount}&cu=INR`;

    res.status(200).json({
      success: true,
      upiUri,
      orderRef,
      upiId,
      amount: totalAmount,
    });
  } catch (error) {
    console.error("UPI Intent Generation Error:", error);
    res.status(500).json({
      message: "Could not generate native UPI string.",
      error: error.message,
    });
  }
});

router.post("/upi/verify", protect, async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { utrCode, orderRef, totalAmount, shippingAddress, cartItems } =
      req.body;

    if (!utrCode || utrCode.length < 12) {
      return res
        .status(400)
        .json({ message: "Invalid 12-Digit Banking UTR Number provided." });
    }

    await connection.beginTransaction();

    for (const item of cartItems) {
      const [products] = await connection.query(
        "SELECT stock_quantity, name FROM products WHERE id = ? FOR UPDATE",
        [item.productId],
      );

      if (products.length === 0) {
        throw new Error(`Product ID ${item.productId} not found.`);
      }

      const product = products[0];
      if (product.stock_quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Remaining: ${product.stock_quantity}`,
        );
      }

      await connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
        [item.quantity, item.productId],
      );
    }

    const [orderRes] = await connection.query(
      `
      INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_id, tracking_number)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        req.user.id,
        totalAmount,
        "payment_pending",
        shippingAddress,
        `UPI_UTR_${utrCode}`,
        "TRK" + Math.floor(Math.random() * 100000000),
      ],
    );

    if (cartItems && cartItems.length > 0) {
      const orderItems = cartItems.map((item) => [
        orderRes.insertId,
        item.productId,
        item.quantity,
        item.price,
      ]);
      await connection.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?
      `,
        [orderItems],
      );
    }

    await connection.query("DELETE FROM cart_items WHERE user_id = ?", [
      req.user.id,
    ]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "UPI Transaction Recorded and Inventory Reserved",
      orderId: orderRes.insertId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Direct UPI Verification Error:", error);
    res.status(500).json({
      success: false,
      message: error.message.includes("stock")
        ? error.message
        : "Server error during payment verification.",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
