import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListingDetails from "./pages/ListingDetails";
import HostDashboard from "./pages/HostDashboard";
import MyBookings from "./pages/MyBookings";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Footer from "./components/Footer";

function App() {
  const { user, authLoading } = useAuth();
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route
          path="/host/dashboard"
          element={
            authLoading ? (
              <p>Loading...</p>
            ) : user?.role === "host" ? (
              <HostDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
