import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  const handleBecomeHost = async () => {
    try {
      const response = await api.post("/auth/become-host");

      setUser(response.data.user);

      alert("Congratulations! You are now a host.");

      navigate("/host/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to become a host");
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b bg-white shadow-sm">
      <Link to="/" className="text-2xl font-bold text-rose-500 tracking-tight">
        Airbnb
      </Link>

      <div className="flex items-center gap-3 md:gap-6 text-sm">
        {user ? (
          <>
            {user.role === "host" ? (
              <Link
                to="/host/dashboard"
                className="font-medium hover:text-rose-500"
              >
                Host Dashboard
              </Link>
            ) : (
              <button
                onClick={handleBecomeHost}
                className="font-medium hover:text-rose-500"
              >
                Become a Host
              </button>
            )}

            <Link to="/my-bookings" className="font-medium hover:text-rose-500">
              My Bookings
            </Link>

            <span className="hidden sm:inline font-medium text-gray-700">
              Hi, {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="font-medium hover:text-rose-500">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-rose-500 text-white px-5 py-2 rounded-full hover:bg-rose-600 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
