import { ArrowLeft, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen flex align-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-200 rounded-lg shadow-2xlxl overflow-hidden relative z-10"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <XCircle className="text-font-main w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-font-main mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-700 text-center mb-6">
            No charges applied. Payment cancelled.
          </p>
          <div className="bg-gray-300 rounded-lg p-4 mb-6">
            <p className="text-md text-gray-700 text-center">
              If you encountered any issues during the checkout process, please
              don&apos;t hesitate to contact our support team.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to={"/"}
              className="w-full bg-gray-300 hover:bg-font-main hover:text-white text-gray-700 font-bold py-2 px-4 rounded-lg transition duration-300 flex align-center"
            >
              <ArrowLeft className="mr-2" size={18} />
              Return to Shop
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PurchaseCancelPage