const Coupon = require("../models/couponModel");

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCouponStats = async (req, res) => {
  try {
    const stats = await Coupon.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const updated = await Coupon.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await Coupon.delete(req.params.id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCouponUsage = async (req, res) => {
  try {
    const usage = await Coupon.getUsage(req.params.id);
    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCoupons,
  getCouponStats,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponUsage,
};
