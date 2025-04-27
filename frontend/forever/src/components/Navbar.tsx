import { ShoppingCart, User, Search, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart, getCartItems, clearCart } = useCartStore();
  const isAdmin = user?.role === "admin";

  // Total cart items
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  // load cartitem when user mount\when there is user
  useEffect(() => {
    if(user) {
      getCartItems();
    }
  }, [user, getCartItems]);

  // Log user out
  const handleLogout = () => {
    logout();
    clearCart();
  };

  return (
    <header className="w-full shadow-sm">
      <nav
        className="flex justify-between items-center py-4 px-6"
        aria-label="Main Nav"
      >
        {/* Logo */}
        <div>
          <Link
            to="/"
            className="text-4xl font-medium tracking-tighter relative"
            aria-label="Main NAV BTN => homepage"
          >
            FOREVER
            <span className="text-logo-dot text-6xl absolute -top-2">.</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-4 font-semibold list-none">
          <li>
            <Link to="/" className="nav-link">
              HOME
            </Link>
          </li>
          <li>
            <Link to="/collection" className="nav-link">
              COLLECTION
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              ABOUT
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              CONTACT
            </Link>
          </li>
        </ul>

        {/* Icons and Auth */}
        <div className="flex gap-4 items-center">
          <button aria-label="Search">
            <Search />
          </button>
          <button aria-label="User profile">
            <User />
          </button>
          <div className="relative">
            <Link to="/cart" aria-label="Shopping cart">
              <ShoppingCart />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {isAdmin && (
            <Link
              className="auth-btn font-medium transition duration-300 ease-in-out"
              to={"/admin-dashboard"}
            >
              <Lock className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {!user ? (
            <Link to="/signup" className="auth-btn">
              signup
            </Link>
          ) : (
            <Link to="/login" className="auth-btn" onClick={handleLogout}>
              Logout
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
