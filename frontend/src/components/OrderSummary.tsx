import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInst from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";

const stripePromise = loadStripe(
  "pk_test_51PuII1AXJVcgr6sMELBssNlTSqwzroltERMazZlAkrmbLBeisyMcZAUMc4NruRBncr25i11wasSwqo4vc0ovvz6W00VSfNsaGH",
);

const OrderSummary = () => {
  const [isPaying, setIsPaying] = useState(false);
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
  const savings = subtotal - total;

  const handlePayment = async () => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      const stripe = await stripePromise;
      const res = await axiosInst.post("/payment/create-checkout-session", {
        products: cart,
        couponCode: coupon ? coupon.code : null,
      });
      const session = res.data;
      await stripe?.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-2xl font-bold text-font-main">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="font-semibold text-gray-700">Original price</dt>
            <dd className="font-semibold text-gray-700">${subtotal}</dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="font-normal text-gray-700">Savings</dt>
              <dd className="font-medium">-${savings}</dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="font-normal text-gray-700">
                {/* Coupon ({coupon.code}) */}
              </dt>
              <dd className="font-medium">-{coupon.discountPercentage}%</dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="font-semibold text-font-main">Total</dt>
            <dd className="font-semibold text-font-main">${total}</dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full align-center rounded-lg auth-btn text-sm font-medium focus:outline-none focus:ring-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
          disabled={isPaying}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex align-center gap-2">
          <span className="text-sm font-normal text-gray-700">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium underline hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
