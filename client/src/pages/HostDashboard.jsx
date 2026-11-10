import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  X,
  Home,
  MapPin,
  Users,
  BedDouble,
  Bath,
  IndianRupee,
  CalendarDays,
  Pencil,
  Trash2,
  Eye,
  ImagePlus,
  LoaderCircle,
} from "lucide-react";

import LocationPicker from "../components/LocationPicker";
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

const categories = [
  "Beach",
  "Mountains",
  "City",
  "Countryside",
  "Amazing Views",
  "Cabins",
  "Luxury",
];

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200";

const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

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

    if (
      formData.lat === "" ||
      formData.lng === "" ||
      !Number.isFinite(Number(formData.lat)) ||
      !Number.isFinite(Number(formData.lng))
    ) {
      setError("Please select your property location on the map.");
      return;
    }

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
    setSelectedImages([]);
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    setError("");
  };

  useEffect(() => {
    fetchMyListings();
    fetchHostBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <LoaderCircle className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  if (error && listings.length === 0) {
    return (
      <div className="w-full px-5 md:px-10 py-12 text-center">
        <p className="text-rose-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-5 md:px-10 lg:px-12 py-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
        <div>
          <div className="flex items-center gap-2 text-rose-500 mb-2">
            <Home size={18} />
            <span className="text-sm font-semibold">HOST PANEL</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Host Dashboard
          </h1>

          <p className="text-gray-500 text-sm md:text-base mt-2">
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
              setSelectedImages([]);
              setExistingImages([]);
              setError("");
              setShowForm(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300"
        >
          {showForm ? <X size={19} /> : <Plus size={19} />}
          {showForm ? "Close Form" : "Add New Listing"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Create / Edit Listing Form */}
      {showForm && (
        <form
          onSubmit={handleCreateListing}
          className="border border-gray-200 rounded-2xl p-5 md:p-8 mb-12 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 mb-7">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                {editingId ? "Edit Listing" : "Create New Listing"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Add your property details below.
              </p>
            </div>

            <div className="hidden sm:flex w-11 h-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Home size={22} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Listing Fields */}
            {Object.entries(formData)
              .filter(([key]) => !["lat", "lng"].includes(key))
              .map(([key, value]) => (
                <div
                  key={key}
                  className={
                    key === "description" || key === "amenities"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <label className={labelClass}>
                    {key === "maxGuests"
                      ? "Maximum Guests"
                      : key === "amenities"
                        ? "Amenities"
                        : key === "bedrooms"
                          ? "Bedrooms"
                          : key === "bathrooms"
                            ? "Bathrooms"
                            : key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>

                  {key === "description" || key === "amenities" ? (
                    <textarea
                      value={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [key]: e.target.value,
                        })
                      }
                      className={`${inputClass} resize-y`}
                      rows={key === "description" ? 4 : 2}
                      placeholder={
                        key === "description"
                          ? "Describe your property..."
                          : "WiFi, Swimming Pool, Parking..."
                      }
                      required={key === "description"}
                    />
                  ) : key === "category" ? (
                    <select
                      value={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [key]: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        [
                          "price",
                          "maxGuests",
                          "bedrooms",
                          "bathrooms",
                        ].includes(key)
                          ? "number"
                          : "text"
                      }
                      min={
                        [
                          "price",
                          "maxGuests",
                          "bedrooms",
                          "bathrooms",
                        ].includes(key)
                          ? "1"
                          : undefined
                      }
                      value={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [key]: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder={`Enter ${key}`}
                      required={!["amenities"].includes(key)}
                    />
                  )}
                </div>
              ))}

            {/* Location Picker */}
            <div className="md:col-span-2 border border-gray-100 rounded-2xl p-4 md:p-5 bg-gray-50/60">
              <LocationPicker
                coordinates={{
                  lat: formData.lat,
                  lng: formData.lng,
                }}
                onChange={(coordinates) =>
                  setFormData((prev) => ({
                    ...prev,
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                  }))
                }
                searchQuery={`${formData.location}, ${formData.country}`}
              />
            </div>

            {/* Property Images */}
            <div className="md:col-span-2">
              <label className={labelClass}>Property Images (Maximum 5)</label>

              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-rose-300 rounded-2xl p-7 cursor-pointer transition-colors bg-gray-50/50">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <ImagePlus size={24} />
                </div>

                <div className="text-center">
                  <p className="font-semibold text-gray-700 text-sm">
                    Click to upload property images
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    You can select up to 5 images
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Existing Images
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt="Existing property"
                          className="w-28 h-24 object-cover rounded-xl border border-gray-200"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setExistingImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow hover:bg-rose-600 transition"
                          title="Remove image"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Images */}
              {selectedImages.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Selected Images
                  </p>

                  <div className="space-y-2">
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                      >
                        <ImagePlus size={17} className="text-rose-500" />

                        <span className="text-sm text-gray-600 truncate">
                          {image.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-7 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formLoading && (
                <LoaderCircle size={18} className="animate-spin" />
              )}

              {formLoading
                ? "Saving..."
                : editingId
                  ? "Update Listing"
                  : "Create Listing"}
            </button>

            <button
              type="button"
              onClick={handleCancelForm}
              className="border border-gray-200 text-gray-700 px-7 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* My Listings */}
      <section className="mb-14">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              My Listings
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage all your listed properties.
            </p>
          </div>

          <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold">
            {listings.length} Properties
          </span>
        </div>

        {listings.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50/50">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Home size={26} />
            </div>

            <h3 className="font-semibold text-gray-800">No listings yet</h3>

            <p className="text-sm text-gray-500 mt-2">
              You haven't created any listings yet.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-5 text-rose-500 font-semibold text-sm hover:text-rose-600"
            >
              + Add your first property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="group border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Listing Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      listing.images?.[0] ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={listing.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {listing.category}
                  </span>
                </div>

                {/* Listing Details */}
                <div className="p-5">
                  <h3 className="font-bold text-lg tracking-tight text-gray-900 truncate">
                    {listing.title}
                  </h3>

                  <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                    <MapPin size={15} className="shrink-0" />
                    <span className="truncate">
                      {listing.location}, {listing.country}
                    </span>
                  </p>

                  <div className="flex items-center gap-1 mt-3">
                    <IndianRupee size={16} className="text-gray-900" />

                    <span className="font-bold text-gray-900">
                      {listing.price}
                    </span>

                    <span className="text-sm text-gray-500">/ night</span>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {listing.maxGuests} Guests
                    </span>

                    <span className="flex items-center gap-1">
                      <BedDouble size={14} />
                      {listing.bedrooms} Beds
                    </span>

                    <span className="flex items-center gap-1">
                      <Bath size={14} />
                      {listing.bathrooms} Baths
                    </span>
                  </div>

                  {/* View Listing */}
                  <Link
                    to={`/listings/${listing._id}`}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl mt-5 hover:bg-gray-700 transition-all duration-200 font-semibold text-sm"
                  >
                    <Eye size={16} />
                    View Listing
                  </Link>

                  {/* Edit / Delete */}
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleEditListing(listing)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200 my-10" />

      {/* Guest Bookings */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Guest Bookings
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Check the reservations made for your properties.
          </p>
        </div>

        {bookingsLoading ? (
          <div className="flex items-center gap-3 text-gray-500 py-6">
            <LoaderCircle size={20} className="animate-spin text-rose-500" />
            <span className="text-sm">Loading guest bookings...</span>
          </div>
        ) : bookingsError ? (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm">
            {bookingsError}
          </div>
        ) : hostBookings.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50/50">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-400">
              <CalendarDays size={25} />
            </div>

            <h3 className="font-semibold text-gray-800">No bookings yet</h3>

            <p className="text-sm text-gray-500 mt-2">
              You haven't received any guest bookings yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {hostBookings.map((booking) => (
              <div
                key={booking._id}
                className="border border-gray-200 rounded-2xl p-5 md:p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {booking.listing?.title || "Property"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {booking.guest?.name || "Guest"}
                    </p>
                  </div>

                  <span
                    className={`w-fit px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                      booking.status === "confirmed"
                        ? "bg-green-50 text-green-700"
                        : booking.status === "cancelled"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <CalendarDays
                      size={18}
                      className="text-rose-500 shrink-0"
                    />

                    <div>
                      <p className="text-xs text-gray-400">Check-in</p>
                      <p className="font-semibold text-gray-800 mt-1">
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <CalendarDays
                      size={18}
                      className="text-rose-500 shrink-0"
                    />

                    <div>
                      <p className="text-xs text-gray-400">Check-out</p>
                      <p className="font-semibold text-gray-800 mt-1">
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <Users size={18} className="text-rose-500 shrink-0" />

                    <div>
                      <p className="text-xs text-gray-400">Guests</p>
                      <p className="font-semibold text-gray-800 mt-1">
                        {booking.guests}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 sm:col-span-2 lg:col-span-1">
                    <IndianRupee size={18} className="text-rose-500 shrink-0" />

                    <div>
                      <p className="text-xs text-gray-400">Total Price</p>
                      <p className="font-bold text-gray-900 mt-1">
                        ₹{booking.totalPrice}
                      </p>
                    </div>
                  </div>
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
