import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../stores/useCartStore';

const CouponCard = () => {
    const [userInputCode, setUserInputCode] = useState("");
    const { coupon, isCouponApplied } = useCartStore();

    const handleApplyCoupon = () => {console.log(userInputCode)};
    const handleRemoveCoupon = () => {console.log("code removed");};
  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="voucher"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Do you have a voucher or gift card?
          </label>
          <input
            type="text"
            id="voucher"
            className="block w-full rounded-lg border border-gray-700
            p-2.5 text-sm text-font-main placeholder-gray-500"
            placeholder="Enter code here"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>

        <motion.button
          type="button"
          className="flex w-full align-center rounded-lg auth-btn text-sm font-medium focus:outline-none focus:ring-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyCoupon}
        >
          Apply Code
        </motion.button>
      </div>
      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700">Applied Coupon</h3>

          <p className="mt-2 text-sm text-gray-500">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>

          <motion.button
            type="button"
            className="auth-btn flex w-full align-center rounded-lg bg-red-600 
             text-sm font-medium text-font-main hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default CouponCard