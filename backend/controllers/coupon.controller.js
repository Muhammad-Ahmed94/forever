import couponModel from "../model/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await couponModel.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.error(`Error getting coupon`, error.message);
    res.sendStatus(500);
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await couponModel.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "coupon not found" });
    }

    res.json({
      message: "coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discount,
    });
  } catch (error) {
    console.error("error validation coupon", error.message);
    res.status(500).json({ message: "could not validate the coupon code" });
  }
};
