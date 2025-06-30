import { Lock, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import useUserStore from "../stores/useUserStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart, getCartItems, clearCart } = useCartStore();
  const isAdmin = user?.role === "admin";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = cart.reduce(
    (total, item) => total + (item.quantity || 0),
    0,
  );

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [user, getCartItems]);

  const handleLogout = () => {
    logout();
    clearCart();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full shadow-sm bg-white fixed top-0 left-0 z-50">
      <nav
        className="flex justify-between items-center py-4 px-6 relative max-w-[1440px] mx-auto"
        aria-label="Main Nav"
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-4xl font-medium tracking-tighter relative z-30"
          aria-label="Main NAV BTN => homepage"
          onClick={() => setIsMenuOpen(false)}
        >
          FOREVER
          <span className="text-logo-dot text-6xl absolute -top-2">.</span>
        </Link>

        {/* cart icon */}
        <div className="md:hidden absolute right-16 top-4 z-30">
          <Link to="/cart" aria-label="Shopping cart" className="relative">
            <ShoppingCart size={28} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Hamburger icon */}
        <div className="md:hidden flex items-center z-30">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* nav links*/}
        <ul className="hidden md:flex gap-6 font-semibold items-center">
          {["HOME", "COLLECTION", "ABOUT", "CONTACT"].map((item) => (
            <li key={item}>
              <Link
                to={`/${item === "HOME" ? "" : item.toLowerCase()}`}
                className="nav-link"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* user Icons */}
        <div className="hidden md:flex gap-4 items-center z-20">
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
            <Link to="/admin-dashboard" className="auth-btn font-medium">
              <Lock size={18} className="inline-block mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {!user ? (
            <Link to="/signup" className="auth-btn">
              signup
            </Link>
          ) : (
            <button onClick={handleLogout} className="auth-btn">
              Logout
            </button>
          )}
        </div>

        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-20 flex flex-col items-center justify-start pt-28 px-6 space-y-8 overflow-y-auto">
            <ul className="flex flex-col gap-6 text-2xl font-semibold w-full text-center">
              {["HOME", "COLLECTION", "ABOUT", "CONTACT"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item === "HOME" ? "" : item.toLowerCase()}`}
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-6 items-center text-lg w-full">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Search size={24} /> Search
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <User size={24} /> Profile
              </button>
              <Link
                to="/cart"
                className="flex items-center gap-2 relative"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart size={24} /> Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  className="auth-btn text-lg w-auto"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Lock className="inline-block mr-2" size={24} />
                  Dashboard
                </Link>
              )}

              {!user ? (
                <Link
                  to="/signup"
                  className="auth-btn text-lg w-auto"
                  onClick={() => setIsMenuOpen(false)}
                >
                  signup
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="auth-btn text-lg w-auto"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
