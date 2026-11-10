import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Users,
  IndianRupee,
  Home,
  XCircle,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";

import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my-bookings");
      setBookings(response.data.bookings || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) return;

    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      alert("Booking cancelled successfully!");
      await fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "confirmed") {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (status === "cancelled") {
      return "bg-rose-50 text-rose-600 border-rose-100";
    }

    if (status === "completed") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <LoaderCircle className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-5 md:px-10 py-16 text-center">
        <p className="text-rose-500 mb-4">{error}</p>

        <button
          onClick={fetchBookings}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-5 md:px-10 lg:px-12 py-10">
      {/* Page Heading */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-rose-500 mb-2">
          <CalendarDays size={18} />
          <span className="text-sm font-semibold">YOUR RESERVATIONS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              My Bookings
            </h1>

            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Manage your trips and property reservations.
            </p>
          </div>

          <span className="w-fit bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold">
            {bookings.length} Bookings
          </span>
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-2xl py-16 px-5 text-center bg-gray-50/50">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-5 text-gray-400">
            <Home size={28} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">No bookings yet</h2>

          <p className="text-gray-500 mt-2 mb-6 text-sm">
            You haven't made any bookings yet. Start exploring and find a place
            for your next trip.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-600 transition-all duration-200"
          >
            Explore Listings
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        /* Booking Cards */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="group border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Property Image */}
                <div className="relative sm:w-56 md:w-64 shrink-0 overflow-hidden bg-gray-100">
                  <img
                    src={
                      booking.listing?.images?.[0] ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={booking.listing?.title || "Property"}
                    className="w-full h-52 sm:h-full min-h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <span
                    className={`absolute top-3 left-3 border text-xs font-semibold capitalize px-3 py-1.5 rounded-full ${getStatusStyle(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Booking Details */}
                <div className="flex-1 min-w-0 p-5 md:p-6">
                  {/* Property Name */}
                  <div className="mb-5">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                      {booking.listing?.title || "Property unavailable"}
                    </h2>

                    <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                      <MapPin size={15} className="shrink-0" />

                      <span>
                        {booking.listing?.location || "Location unavailable"}
                        {booking.listing?.country
                          ? `, ${booking.listing.country}`
                          : ""}
                      </span>
                    </p>
                  </div>

                  {/* Booking Information */}
                  <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-5">
                    <div className="flex items-start gap-2.5">
                      <CalendarDays
                        size={18}
                        className="text-rose-500 mt-0.5 shrink-0"
                      />

                      <div>
                        <p className="text-xs text-gray-400">Check-in</p>

                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CalendarDays
                        size={18}
                        className="text-rose-500 mt-0.5 shrink-0"
                      />

                      <div>
                        <p className="text-xs text-gray-400">Check-out</p>

                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Users
                        size={18}
                        className="text-rose-500 mt-0.5 shrink-0"
                      />

                      <div>
                        <p className="text-xs text-gray-400">Guests</p>

                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {booking.guests}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <IndianRupee
                        size={18}
                        className="text-rose-500 mt-0.5 shrink-0"
                      />

                      <div>
                        <p className="text-xs text-gray-400">Total Price</p>

                        <p className="text-sm font-bold text-gray-900 mt-1">
                          ₹{booking.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    {booking.listing?._id && (
                      <Link
                        to={`/listings/${booking.listing._id}`}
                        className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                      >
                        View Property
                        <ArrowRight size={15} />
                      </Link>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="inline-flex items-center justify-center gap-2 border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                      >
                        <XCircle size={16} />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
