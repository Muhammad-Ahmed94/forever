import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import GetProductByCategory from "./pages/GetProductByCategory";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import SignUpPage from "./pages/SignUpPage";
import useUserStore from "./stores/useUserStore";

const App = () => {
  const { user, checkAuth, checkingAuth } = useUserStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

 if (checkingAuth) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-font-main text-xl">Loading...</div>
    </div>
  )
 }
  return (
    <div className="min-h-screen bg-bg-primary relative text-font-main overflow-hidden">
      <div className="relative z-50 p-12">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />

          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/admin-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/category/:category"
            element={<GetProductByCategory />}
          />

          <Route 
            path="/cart" 
            element={user ? <CartPage /> : <Navigate to="/login" />} 
          />
          <Route path="/purchase-success/*" element={<PurchaseSuccessPage />} />
          <Route path="/purchase-cancel/*" element={<PurchaseCancelPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
};

export default App;
