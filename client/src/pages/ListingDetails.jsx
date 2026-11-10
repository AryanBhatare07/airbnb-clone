
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ListingMap from "../components/ListingMap";

function ListingDetails() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/listings/${id}`);
        setListing(response.data.listing);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/listing/${id}`);
        setReviews(response.data.reviews);
        setAverageRating(response.data.averageRating);
        setTotalReviews(response.data.totalReviews);
      } catch (error) {
        console.log("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await api.get("/bookings/my-bookings");

        const completedBookings = (response.data.bookings || []).filter(
          (booking) =>
            booking.status === "completed" &&
            (booking.listing?._id || booking.listing) === id
        );

        setMyBookings(completedBookings);
      } catch (error) {
        console.log("Fetch My Bookings Error:", error);
      }
    };

    fetchMyBookings();
  }, [id]);

  const handleBooking = async () => {
    setBookingMessage("");
    setBookingError("");

    if (!checkIn || !checkOut) {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setBookingError("Check-out must be after check-in.");
      return;
    }

    if (Number(guests) < 1 || Number(guests) > listing.maxGuests) {
      setBookingError("Please select a valid number of guests.");
      return;
    }

    try {
      setBookingLoading(true);

      const response = await api.post("/bookings", {
        listingId: id,
        checkIn,
        checkOut,
        guests: Number(guests),
      });

      setBookingMessage(response.data.message || "Booking successful!");
    } catch (error) {
      setBookingError(error.response?.data?.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      setReviewLoading(true);
      setReviewError("");
      setReviewMessage("");

      const response = await api.post("/reviews", {
        bookingId,
        rating: Number(reviewRating),
        comment: reviewComment,
      });

      setReviewMessage(response.data.message);

      setBookingId("");
      setReviewRating(5);
      setReviewComment("");

      const updatedReviews = await api.get(`/reviews/listing/${id}`);

      setReviews(updatedReviews.data.reviews);
      setAverageRating(updatedReviews.data.averageRating);
      setTotalReviews(updatedReviews.data.totalReviews);
    } catch (error) {
      setReviewError(
        error.response?.data?.message || "Failed to submit review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading listing...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!listing) {
    return <p className="text-center mt-10">Listing not found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">

      {/* Listing Heading */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {listing.title}
        </h1>

        <p className="text-gray-500 mt-2">
          {listing.location}, {listing.country}
        </p>

        {totalReviews > 0 && (
          <p className="text-sm mt-2">
            ⭐ {averageRating} / 5 · {totalReviews} reviews
          </p>
        )}
      </div>

      {/* Listing Images */}
      <div className="grid grid-cols-2 gap-3 max-w-3xl mx-auto mb-10">
        {listing.images?.length > 0 ? (
          listing.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={listing.title}
              className="w-full h-36 md:h-48 object-cover rounded-xl"
            />
          ))
        ) : (
          <p className="text-gray-500">No images available.</p>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Section */}
        <div className="md:col-span-2">

          {/* About */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              About this place
            </h2>

            <p className="text-gray-600 leading-7">
              {listing.description}
            </p>
          </section>

          <hr className="my-6" />

          {/* Property Details */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Property Details
            </h2>

            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <p>Category: {listing.category}</p>
              <p>Maximum Guests: {listing.maxGuests}</p>
              <p>Bedrooms: {listing.bedrooms}</p>
              <p>Bathrooms: {listing.bathrooms}</p>
            </div>
          </section>

          <hr className="my-6" />

          {/* Amenities */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Amenities
            </h2>

            {listing.amenities?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {listing.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No amenities listed.</p>
            )}
          </section>

          <hr className="my-6" />

          {/* Map */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Where you'll be
            </h2>

            <ListingMap
              coordinates={listing.coordinates}
              location={listing.location}
            />
          </section>

          <hr className="my-6" />

          {/* Reviews */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Reviews ({totalReviews})
            </h2>

            <p className="text-gray-600 mb-5">
              ⭐ {averageRating} / 5
            </p>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border rounded-xl p-4"
                  >
                    <h3 className="font-semibold">
                      {review.user?.name || "Guest"}
                    </h3>

                    <p className="text-yellow-500 my-2">
                      {"⭐".repeat(review.rating)}
                    </p>

                    <p className="text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </section>

          <hr className="my-6" />

          {/* Write Review */}
          <section className="border rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-4">
              Write a Review
            </h2>

            {myBookings.length === 0 && (
              <p className="text-gray-500 mb-4 text-sm">
                You need a completed booking to write a review.
              </p>
            )}

            <form onSubmit={handleSubmitReview}>
              <select
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
                required
              >
                <option value="">Select Completed Booking</option>

                {myBookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    Booking - {booking._id.slice(-6)}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-sm font-medium">
                Rating
              </label>

              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
              >
                <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                <option value="4">⭐⭐⭐⭐ - Very Good</option>
                <option value="3">⭐⭐⭐ - Good</option>
                <option value="2">⭐⭐ - Average</option>
                <option value="1">⭐ - Poor</option>
              </select>

              <textarea
                placeholder="Write your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
                rows="4"
                required
              />

              <button
                type="submit"
                disabled={reviewLoading || myBookings.length === 0}
                className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-lg disabled:opacity-50"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>

              {reviewMessage && (
                <p className="text-green-600 mt-3 text-sm">
                  {reviewMessage}
                </p>
              )}

              {reviewError && (
                <p className="text-red-500 mt-3 text-sm">
                  {reviewError}
                </p>
              )}
            </form>
          </section>
        </div>

        {/* Right Section: Booking */}
        <div>
          <div className="border rounded-xl p-6 shadow-sm h-fit md:sticky md:top-24">

            <p className="text-2xl font-bold">
              ₹{listing.price}
              <span className="text-base font-normal text-gray-500">
                {" "} / night
              </span>
            </p>

            <hr className="my-4" />

            <h3 className="font-semibold mb-4">
              Book Your Stay
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Check-in
                </label>

                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Check-out
                </label>

                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Guests
                </label>

                <input
                  type="number"
                  min="1"
                  max={listing.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>

              {bookingError && (
                <p className="text-red-500 text-sm">
                  {bookingError}
                </p>
              )}

              {bookingMessage && (
                <p className="text-green-600 text-sm">
                  {bookingMessage}
                </p>
              )}
            </div>

            <hr className="my-5" />

            <h3 className="font-semibold mb-2">
              Hosted by
            </h3>

            <p className="text-gray-600">
              {listing.host?.name || "Host"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
