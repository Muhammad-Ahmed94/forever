import { ShoppingCart, User, Search } from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "../stores/useUserStore";

const Navbar = () => {
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
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
          <button aria-label="Shopping cart">
            <ShoppingCart />
          </button>

          {!user ? (
            <Link to="/signup" className="auth-btn">
              signup
            </Link>
          ) : (
            <Link to="/login" className="auth-btn" onClick={handleLogout}>Logout</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
