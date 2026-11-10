import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  UserPlus,
  User,
  House,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [hostLoading, setHostLoading] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      closeMenu();
      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  const handleBecomeHost = async () => {
    try {
      setHostLoading(true);

      const response = await api.post("/auth/become-host");

      setUser(response.data.user);
      closeMenu();

      alert("Congratulations! You are now a host.");

      navigate("/host/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to become a host");
    } finally {
      setHostLoading(false);
    }
  };

  const navLinkStyle =
    "flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-rose-500 transition-colors";

  const mobileLinkStyle =
    "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors";

  return (
    <nav className="sticky top-2 z-50 mx-3 sm:mx-5 md:mx-8 mt-3">
      {/* Navbar Container */}
      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-md px-4 sm:px-6 md:px-8">
        <div className="h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 shrink-0"
          >
            <img
              src="https://cdn.simpleicons.org/airbnb/FF385C"
              alt="Airbnb"
              className="w-8 h-8 object-contain"
            />

            <span className="text-xl sm:text-2xl font-bold text-[#FF385C] tracking-tight">
              airbnb
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {user ? (
              <>
                {user.role === "host" ? (
                  <Link to="/host/dashboard" className={navLinkStyle}>
                    <LayoutDashboard size={17} />
                    Host Dashboard
                  </Link>
                ) : (
                  <button
                    onClick={handleBecomeHost}
                    disabled={hostLoading}
                    className={`${navLinkStyle} disabled:opacity-50`}
                  >
                    <House size={17} />
                    {hostLoading ? "Please wait..." : "Become a Host"}
                  </button>
                )}

                <Link to="/my-bookings" className={navLinkStyle}>
                  <CalendarDays size={17} />
                  My Bookings
                </Link>

                <div className="flex items-center gap-2 border-l border-gray-200 pl-5">
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                    <User size={18} />
                  </div>

                  <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                    Hi, {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-rose-500 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkStyle}>
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-600 transition shadow-sm"
                >
                  <UserPlus size={17} />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {user ? (
              <div className="space-y-2">
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-rose-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white text-rose-500 flex items-center justify-center">
                    <User size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                {user.role === "host" ? (
                  <Link
                    to="/host/dashboard"
                    onClick={closeMenu}
                    className={mobileLinkStyle}
                  >
                    <LayoutDashboard size={19} />
                    Host Dashboard
                  </Link>
                ) : (
                  <button
                    onClick={handleBecomeHost}
                    disabled={hostLoading}
                    className={`${mobileLinkStyle} disabled:opacity-50`}
                  >
                    <House size={19} />
                    {hostLoading ? "Please wait..." : "Become a Host"}
                  </button>
                )}

                <Link
                  to="/my-bookings"
                  onClick={closeMenu}
                  className={mobileLinkStyle}
                >
                  <CalendarDays size={19} />
                  My Bookings
                </Link>

                <button
                  onClick={handleLogout}
                  className={`${mobileLinkStyle} hover:bg-red-50 hover:text-red-500`}
                >
                  <LogOut size={19} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={mobileLinkStyle}
                >
                  <User size={19} />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className={`${mobileLinkStyle} bg-rose-500 text-white hover:bg-rose-600 hover:text-white`}
                >
                  <UserPlus size={19} />
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
