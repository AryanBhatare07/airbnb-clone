import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Users,
  BedDouble,
  Bath,
  CalendarDays,
  LoaderCircle,
  House,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
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
        setError("");

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
            (booking.listing?._id || booking.listing) === id,
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
        error.response?.data?.message || "Failed to submit review.",
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <LoaderCircle size={35} className="animate-spin text-rose-500" />
        <p className="text-gray-500">Loading property details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5">
        <House size={40} className="text-gray-300 mb-3" />
        <p className="text-red-500 text-center">
          {error || "Listing not found."}
        </p>
      </div>
    );
  }

  const images = listing.images || [];

  const inputStyle =
    "w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition";

  return (
    <div className="w-full max-w-none px-5 md:px-10 lg:px-12 py-8">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {listing.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={16} />
            {listing.location}, {listing.country}
          </span>

          {totalReviews > 0 && (
            <span className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              {Number(averageRating).toFixed(1)} ({totalReviews} reviews)
            </span>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10 h-auto md:h-[420px] overflow-hidden rounded-2xl">
        {images.length > 0 ? (
          <>
            <div className="md:col-span-2 md:row-span-2 h-64 md:h-full overflow-hidden">
              <img
                src={images[0]}
                alt={listing.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="hidden md:block h-full overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${listing.title} ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            ))}
          </>
        ) : (
          <div className="md:col-span-4 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
            No images available.
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Content */}
        <div className="lg:col-span-2">
          {/* About */}
          <section className="pb-7 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              About this place
            </h2>

            <p className="text-gray-600 leading-7 whitespace-pre-line">
              {listing.description}
            </p>

            <div className="flex flex-wrap gap-5 mt-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Users size={18} className="text-rose-500" />
                {listing.maxGuests} Guests
              </span>

              <span className="flex items-center gap-2">
                <BedDouble size={18} className="text-rose-500" />
                {listing.bedrooms} Bedrooms
              </span>

              <span className="flex items-center gap-2">
                <Bath size={18} className="text-rose-500" />
                {listing.bathrooms} Bathrooms
              </span>
            </div>
          </section>

          {/* Property Details */}
          <section className="py-7 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Property Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Category", listing.category],
                ["Maximum Guests", listing.maxGuests],
                ["Bedrooms", listing.bedrooms],
                ["Bathrooms", listing.bathrooms],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section className="py-7 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              What this place offers
            </h2>

            {listing.amenities?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <CheckCircle2 size={19} className="text-rose-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No amenities listed.</p>
            )}
          </section>

          {/* Map */}
          <section className="py-7 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Where you'll be
            </h2>

            <ListingMap
              coordinates={listing.coordinates}
              location={listing.location}
            />
          </section>

          {/* Reviews */}
          <section className="py-7 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Star size={21} className="text-yellow-500" />
              Reviews ({totalReviews})
            </h2>

            <p className="text-gray-600 mb-6">
              {totalReviews > 0
                ? `${Number(averageRating).toFixed(1)} out of 5`
                : "No ratings yet"}
            </p>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {review.user?.name || "Guest"}
                    </h3>

                    <div className="flex items-center gap-1 my-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={15}
                          className={
                            index < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 leading-6">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </section>

          {/* Write Review */}
          <section className="py-7">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare size={21} className="text-rose-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Write a Review
              </h2>
            </div>

            {myBookings.length === 0 && (
              <p className="text-gray-500 text-sm mb-5">
                You need a completed booking to write a review.
              </p>
            )}

            <form
              onSubmit={handleSubmitReview}
              className="border border-gray-100 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Completed Booking
                </label>

                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className={inputStyle}
                  required
                >
                  <option value="">Select a booking</option>

                  {myBookings.map((booking) => (
                    <option key={booking._id} value={booking._id}>
                      Booking - {booking._id.slice(-6)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Rating
                </label>

                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className={inputStyle}
                >
                  <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                  <option value="4">⭐⭐⭐⭐ - Very Good</option>
                  <option value="3">⭐⭐⭐ - Good</option>
                  <option value="2">⭐⭐ - Average</option>
                  <option value="1">⭐ - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Experience
                </label>

                <textarea
                  placeholder="Share your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className={inputStyle}
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading || myBookings.length === 0}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {reviewLoading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>

              {reviewMessage && (
                <p className="text-green-600 text-sm">{reviewMessage}</p>
              )}

              {reviewError && (
                <p className="text-red-500 text-sm">{reviewError}</p>
              )}
            </form>
          </section>
        </div>

        {/* Right: Booking Card */}
        <div>
          <div className="border border-gray-200 rounded-2xl p-6 shadow-sm h-fit lg:sticky lg:top-24">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">
                ₹{listing.price}
              </span>

              <span className="text-sm text-gray-500">/ night</span>
            </div>

            <div className="border-t border-gray-100 my-5" />

            <h3 className="font-bold text-gray-900 mb-5">Book Your Stay</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <CalendarDays size={15} className="inline mr-1" />
                  Check-in
                </label>

                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <CalendarDays size={15} className="inline mr-1" />
                  Check-out
                </label>

                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users size={15} className="inline mr-1" />
                  Guests
                </label>

                <input
                  type="number"
                  min="1"
                  max={listing.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className={inputStyle}
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>

              {bookingError && (
                <p className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                  {bookingError}
                </p>
              )}

              {bookingMessage && (
                <p className="bg-green-50 text-green-700 text-sm p-3 rounded-xl">
                  {bookingMessage}
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 my-5" />

            <h3 className="font-semibold text-gray-900 mb-3">Hosted by</h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
                <House size={19} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  {listing.host?.name || "Host"}
                </p>
                <p className="text-xs text-gray-400">Property Host</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
