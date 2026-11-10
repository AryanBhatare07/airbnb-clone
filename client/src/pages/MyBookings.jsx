import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading bookings...</div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

      <p className="text-gray-500 mt-2 mb-8">
        Manage your property reservations.
      </p>

      {bookings.length === 0 ? (
        <div className="text-center border rounded-xl py-14 px-5">
          <h2 className="text-xl font-semibold text-gray-800">
            No bookings yet
          </h2>

          <p className="text-gray-500 mt-2 mb-5">
            You haven't made any bookings yet.
          </p>

          <Link
            to="/"
            className="inline-block bg-rose-500 text-white px-5 py-2 rounded-lg hover:bg-rose-600"
          >
            Explore Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-xl p-4 md:p-5 flex flex-col sm:flex-row gap-5"
            >
              <img
                src={
                  booking.listing?.images?.[0] ||
                  "https://placehold.co/400x300?text=No+Image"
                }
                alt={booking.listing?.title || "Property"}
                className="w-full sm:w-40 h-48 sm:h-32 object-cover rounded-lg flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {booking.listing?.title || "Property unavailable"}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {booking.listing?.location}, {booking.listing?.country}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-medium capitalize px-3 py-1 rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                  <p>
                    <span className="text-gray-500">Check-in</span>
                    <br />
                    <strong>
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </strong>
                  </p>

                  <p>
                    <span className="text-gray-500">Check-out</span>
                    <br />
                    <strong>
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </strong>
                  </p>

                  <p>
                    <span className="text-gray-500">Guests</span>
                    <br />
                    <strong>{booking.guests}</strong>
                  </p>

                  <p>
                    <span className="text-gray-500">Total Price</span>
                    <br />
                    <strong>₹{booking.totalPrice}</strong>
                  </p>
                </div>

                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="mt-5 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
