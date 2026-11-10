import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", formData);

      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-7 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Create Account
        </h1>

        <p className="text-gray-500 text-sm text-center mt-2 mb-7">
          Register to start exploring places.
        </p>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-rose-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-rose-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-rose-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold p-3 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-rose-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
