import { useEffect, useState } from "react";
import api from "../services/api";
import ListingCard from "../components/ListingCard";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  Home as HomeIcon,
  LoaderCircle,
  SearchX,
} from "lucide-react";

const initialFilters = {
  search: "",
  location: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  guests: "",
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

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(initialFilters);

  const fetchListings = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      Object.keys(appliedFilters).forEach((key) => {
        if (appliedFilters[key] !== "") {
          params[key] = appliedFilters[key];
        }
      });

      const response = await api.get("/listings", { params });
      setListings(response.data.listings || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    fetchListings(initialFilters);
  };

  useEffect(() => {
    fetchListings(initialFilters);
  }, []);

  const inputStyle =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200";

  const labelStyle = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <main className="w-full max-w-none px-5 md:px-10 lg:px-12 py-10">
      {/* Hero Heading */}
      <section className="mb-9">
        <div className="flex items-center gap-2 text-rose-500 mb-3">
          <HomeIcon size={18} />
          <span className="text-sm font-semibold">FIND YOUR NEXT GETAWAY</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          Find Your Perfect Stay
        </h1>

        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Discover comfortable places for your next trip.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 mb-12 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={19} className="text-rose-500" />

          <h2 className="text-lg font-bold text-gray-900">Find a Property</h2>
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {/* Search */}
            <div className="xl:col-span-2">
              <label className={labelStyle}>Search Property</label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="search"
                  placeholder="Property name..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className={`${inputStyle} pl-11`}
                />
              </div>
            </div>

            {/* Location */}
            <div className="xl:col-span-2">
              <label className={labelStyle}>Location</label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Where do you want to go?"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className={`${inputStyle} pl-11`}
                />
              </div>
            </div>

            {/* Category */}
            <div className="xl:col-span-2">
              <label className={labelStyle}>Category</label>

              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className={inputStyle}
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Price */}
            <div>
              <label className={labelStyle}>Minimum Price (₹)</label>

              <input
                type="number"
                name="minPrice"
                min="0"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className={inputStyle}
              />
            </div>

            {/* Maximum Price */}
            <div>
              <label className={labelStyle}>Maximum Price (₹)</label>

              <input
                type="number"
                name="maxPrice"
                min="0"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className={inputStyle}
              />
            </div>

            {/* Guests */}
            <div>
              <label className={labelStyle}>Guests</label>

              <input
                type="number"
                name="guests"
                min="1"
                placeholder="No. of guests"
                value={filters.guests}
                onChange={handleFilterChange}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-7 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all duration-200"
            >
              <RotateCcw size={16} />
              Reset Filters
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white px-7 py-3 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60"
            >
              <Search size={17} />
              Search Properties
            </button>
          </div>
        </form>
      </section>

      {/* Listings Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Explore Stays
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Discover places that are perfect for your next trip.
            </p>
          </div>

          {!loading && !error && (
            <span className="text-sm font-semibold text-gray-500">
              {listings.length} Properties Found
            </span>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="min-h-[250px] flex flex-col items-center justify-center gap-3">
            <LoaderCircle size={32} className="text-rose-500 animate-spin" />

            <p className="text-sm text-gray-500">
              Finding properties for you...
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div className="border border-rose-100 bg-rose-50 rounded-2xl p-8 text-center">
            <p className="text-rose-600 font-medium">{error}</p>

            <button
              onClick={() => fetchListings(filters)}
              className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              Try Again
            </button>
          </div>
        ) : listings.length === 0 ? (
          /* Empty State */
          <div className="border border-dashed border-gray-300 rounded-2xl py-16 px-5 text-center bg-gray-50/50">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-5 text-gray-400">
              <SearchX size={28} />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              No listings found
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Try changing your filters or search for another location.
            </p>

            <button
              onClick={handleReset}
              className="mt-5 inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              <RotateCcw size={15} />
              Clear Filters
            </button>
          </div>
        ) : (
          /* Listing Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-9">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
