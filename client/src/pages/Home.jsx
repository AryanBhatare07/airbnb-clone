import { useEffect, useState } from "react";
import api from "../services/api";
import ListingCard from "../components/ListingCard";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
  });

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
      setListings(response.data.listings);
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
    const resetFilters = {
      search: "",
      location: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      guests: "",
    };

    setFilters(resetFilters);
    fetchListings(resetFilters);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 transition";

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-gray-800">
          Find Your Perfect Stay
        </h1>
        <p className="text-gray-500 mt-2">
          Discover comfortable places for your next trip.
        </p>
      </div>

      {/* Search and Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-gray-200 rounded-xl p-5 mb-10 shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Property
            </label>
            <input
              type="text"
              name="search"
              placeholder="Property name..."
              value={filters.search}
              onChange={handleFilterChange}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Where do you want to go?"
              value={filters.location}
              onChange={handleFilterChange}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className={inputStyle}
            >
              <option value="">All Categories</option>
              <option value="Beach">Beach</option>
              <option value="Mountains">Mountains</option>
              <option value="City">City</option>
              <option value="Countryside">Countryside</option>
              <option value="Amazing Views">Amazing Views</option>
              <option value="Cabins">Cabins</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Price (₹)
            </label>
            <input
              type="number"
              name="minPrice"
              min="0"
              placeholder="Minimum price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Price (₹)
            </label>
            <input
              type="number"
              name="maxPrice"
              min="0"
              placeholder="Maximum price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Guests</label>
            <input
              type="number"
              name="guests"
              min="1"
              placeholder="Number of guests"
              value={filters.guests}
              onChange={handleFilterChange}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={handleReset}
            className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition"
          >
            Reset
          </button>

          <button
            type="submit"
            className="bg-rose-500 text-white px-7 py-2.5 rounded-lg hover:bg-rose-600 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Listings */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Explore Stays
        </h2>

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading listings...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : listings.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No listings found. Try changing your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
