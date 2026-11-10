import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const initialFormData = {
  title: "",
  description: "",
  price: "",
  location: "",
  country: "",
  category: "Beach",
  maxGuests: 1,
  bedrooms: 1,
  bathrooms: 1,
  lat: "",
  lng: "",
  amenities: "",
};

const HostDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [hostBookings, setHostBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/listings/my-listings");
      setListings(response.data.listings || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const fetchHostBookings = async () => {
    try {
      setBookingsLoading(true);
      setBookingsError("");

      const response = await api.get("/bookings/host-bookings");
      setHostBookings(response.data.bookings || []);
    } catch (error) {
      setBookingsError(
        error.response?.data?.message || "Failed to fetch bookings.",
      );
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();

    try {
      setFormLoading(true);
      setError("");

      const listingData = new FormData();

      listingData.append("title", formData.title);
      listingData.append("description", formData.description);
      listingData.append("price", formData.price);
      listingData.append("location", formData.location);
      listingData.append("country", formData.country);
      listingData.append("category", formData.category);
      listingData.append("maxGuests", formData.maxGuests);
      listingData.append("bedrooms", formData.bedrooms);
      listingData.append("bathrooms", formData.bathrooms);

      listingData.append(
        "coordinates",
        JSON.stringify({
          lat: Number(formData.lat),
          lng: Number(formData.lng),
        }),
      );

      listingData.append(
        "amenities",
        JSON.stringify(
          formData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );

      listingData.append("existingImages", JSON.stringify(existingImages));

      selectedImages.forEach((image) => {
        listingData.append("images", image);
      });

      let response;

      if (editingId) {
        response = await api.patch(`/listings/${editingId}`, listingData);
      } else {
        response = await api.post("/listings", listingData);
      }

      alert(response.data.message);

      setFormData(initialFormData);
      setSelectedImages([]);
      setExistingImages([]);
      setEditingId(null);
      setShowForm(false);

      await fetchMyListings();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save listing.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditListing = (listing) => {
    setEditingId(listing._id);

    setFormData({
      title: listing.title || "",
      description: listing.description || "",
      price: listing.price || "",
      location: listing.location || "",
      country: listing.country || "",
      category: listing.category || "Beach",
      maxGuests: listing.maxGuests || 1,
      bedrooms: listing.bedrooms || 1,
      bathrooms: listing.bathrooms || 1,
      lat: listing.coordinates?.lat ?? "",
      lng: listing.coordinates?.lng ?? "",
      amenities: listing.amenities?.join(", ") || "",
    });
    setExistingImages(listing.images || []);

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length + existingImages.length > 5) {
      alert("Maximum 5 images are allowed.");
      e.target.value = "";
      return;
    }

    setSelectedImages(files);
  };

  const handleDeleteListing = async (listingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/listings/${listingId}`);
      alert("Listing deleted successfully!");
      await fetchMyListings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete listing.");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormData);
    setSelectedImages([]);
    setExistingImages([]);
  };

  useEffect(() => {
    fetchMyListings();
    fetchHostBookings();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading your dashboard...</p>;
  }

  if (error && listings.length === 0) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      {/* Dashboard Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Manage your property listings and guest bookings.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setEditingId(null);
              setFormData(initialFormData);
              setShowForm(true);
            }
          }}
          className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-lg font-medium transition"
        >
          {showForm ? "Close Form" : "+ Add New Listing"}
        </button>
      </div>

      {error && (
        <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-5">{error}</p>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleCreateListing}
          className="border border-gray-200 rounded-xl p-5 md:p-6 mb-10 bg-white"
        >
          <h2 className="text-xl font-semibold mb-6">
            {editingId ? "Edit Listing" : "Create New Listing"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(formData).map(([key, value]) => (
              <div
                key={key}
                className={key === "description" ? "md:col-span-2" : ""}
              >
                <label className="block mb-2 capitalize font-medium text-sm">
                  {key}
                </label>

                {key === "description" ? (
                  <textarea
                    value={value}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 outline-none focus:border-rose-500"
                    rows="4"
                    required
                  />
                ) : key === "category" ? (
                  <select
                    value={value}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 outline-none focus:border-rose-500"
                  >
                    {[
                      "Beach",
                      "Mountains",
                      "City",
                      "Countryside",
                      "Amazing Views",
                      "Cabins",
                      "Luxury",
                    ].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={
                      ["price", "maxGuests", "bedrooms", "bathrooms"].includes(
                        key,
                      )
                        ? "number"
                        : "text"
                    }
                    min={
                      ["price", "maxGuests", "bedrooms", "bathrooms"].includes(
                        key,
                      )
                        ? "1"
                        : undefined
                    }
                    value={value}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 outline-none focus:border-rose-500"
                    required
                  />
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-sm">
                Property Images (Maximum 5)
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full border rounded-lg p-3"
              />

              {existingImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Existing Images</p>

                  <div className="flex flex-wrap gap-3">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt="Existing property"
                          className="w-24 h-20 object-cover rounded-lg"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setExistingImages(
                              existingImages.filter((_, i) => i !== index),
                            )
                          }
                          className="text-xs text-red-500 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected Images</p>

                  {selectedImages.map((image, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {image.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="submit"
              disabled={formLoading}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg disabled:opacity-60"
            >
              {formLoading
                ? "Saving..."
                : editingId
                  ? "Update Listing"
                  : "Create Listing"}
            </button>

            <button
              type="button"
              onClick={handleCancelForm}
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* My Listings */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-5">
          My Listings ({listings.length})
        </h2>

        {listings.length === 0 ? (
          <p className="text-gray-500 border rounded-xl p-6">
            You haven't created any listings yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-xl overflow-hidden bg-white"
              >
                <img
                  src={
                    listing.images?.[0] ||
                    "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={listing.title}
                  className="w-full h-44 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-lg">{listing.title}</h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {listing.location}, {listing.country}
                  </p>

                  <p className="font-semibold mt-2">₹{listing.price} / night</p>

                  <Link
                    to={`/listings/${listing._id}`}
                    className="block text-center bg-gray-900 text-white py-2 rounded-lg mt-4 hover:bg-gray-700 transition"
                  >
                    View Listing
                  </Link>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleEditListing(listing)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <hr className="my-8" />

      {/* Guest Bookings */}
      <section>
        <h2 className="text-2xl font-bold mb-5">
          Guest Bookings ({hostBookings.length})
        </h2>

        {bookingsLoading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : bookingsError ? (
          <p className="text-red-500">{bookingsError}</p>
        ) : hostBookings.length === 0 ? (
          <p className="text-gray-500 border rounded-xl p-6">
            No bookings received yet.
          </p>
        ) : (
          <div className="space-y-4">
            {hostBookings.map((booking) => (
              <div key={booking._id} className="border rounded-xl p-5 bg-white">
                <h3 className="font-semibold text-lg mb-2">
                  {booking.listing?.title || "Property"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>Guest: {booking.guest?.name || "Guest"}</p>

                  <p>
                    Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                  </p>

                  <p>
                    Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                  </p>

                  <p>Guests: {booking.guests}</p>

                  <p>Total Price: ₹{booking.totalPrice}</p>

                  <p>
                    Status:{" "}
                    <span className="font-medium capitalize">
                      {booking.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HostDashboard;
