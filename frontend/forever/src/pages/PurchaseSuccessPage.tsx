import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInst from "../lib/axios";
import Confetti from "react-confetti";

import { useCartStore } from "../stores/useCartStore";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const handlePaymentSuccess = async (sessionId: string) => {
      try {
        await axiosInst.post("/payment/checkout-success", { sessionId });
        clearCart();
        setIsProcessing(false);
      } catch (error) {
        console.log(error);
        setIsProcessing(false);
        setError("Error processing payment");
      }
    };

    // Get session ID from URL and process payment
    const urlSessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (urlSessionId) {
      handlePaymentSuccess(urlSessionId);
    } else {
      setIsProcessing(false);
      setError("No session ID found in the URL");
    }
  }, [clearCart]);

  if (isProcessing)
    return (
      <div className="flex justify-center items-center h-screen">
        Processing payment...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="h-screen flex align-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-300 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-font-main w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-font-main mb-2">
            Purchase Successful!
          </h1>

          <p className="text-gray-700 text-center mb-2">
            Thank you for your order. {"We're"} processing it now.
          </p>
          <p className="text-font-main text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>
          <div className="bg-gray-300 rounded-lg p-4 mb-6">
            <div className="flex align-center gap-2 mb-2">
              <span className="text-lg text-gray-700">Order number</span>
              <span className="text-lg font-semibold text-font-main">
                #12345
              </span>
            </div>
            <div className="flex align-center gap-2">
              <span className="text-sm text-gray-700">Estimated delivery</span>
              <span className="text-sm font-semibold text-font-main">
                3-5 business days
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full text-font-main font-bold py-2 px-4
             rounded-lg transition duration-300 flex align-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <Link
              to={"/"}
              className="w-full bg-gray-500 text-black/70 hover:bg-font-main hover:text-white font-bold py-2 px-4 
              rounded-lg transition duration-300 flex align-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
