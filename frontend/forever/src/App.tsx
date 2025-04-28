import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import useUserStore from "./stores/useUserStore"
import { useEffect } from "react"
import AdminPage from "./pages/AdminPage"
import GetProductByCategory from "./pages/GetProductByCategory"
import CartPage from "./pages/CartPage"
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage"
import PurchaseCancelPage from "./pages/PurchaseCancelPage"

const App = () => {
  const {user, checkAuth} = useUserStore();
  if(user) {
    console.log(user?.role, user?.name);
  }
  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  //!TODO Implement protect route for cart page 
  //!{user ? <CartPage /> : <CartInvalidPage />}
  return (
    <div className="min-h-screen bg-bg-primary relative text-font-main overflow-hidden">
      <div className="relative z-50 p-12">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />} />
          <Route path="/category/:category" element={<GetProductByCategory />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/purchase-success" element = {<PurchaseSuccessPage />} />
          <Route path="/purchase-cancel" element = {<PurchaseCancelPage />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App