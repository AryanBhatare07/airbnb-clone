import { Link } from "react-router-dom";

function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing._id}`} className="block group">
      <div className="cursor-pointer">
        {/* Property Image */}
        <div className="w-full h-52 overflow-hidden rounded-xl bg-gray-100">
          <img
            src={
              listing.images?.[0] ||
              "https://placehold.co/600x400?text=No+Image"
            }
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Property Details */}
        <div className="mt-3 space-y-1">
          <h2 className="font-semibold text-gray-900 truncate">
            {listing.title}
          </h2>

          <p className="text-sm text-gray-500">
            {listing.location}, {listing.country}
          </p>

          <p className="text-sm text-gray-500">
            {listing.maxGuests} guests · {listing.bedrooms} bedrooms
          </p>

          <p className="pt-1 text-gray-900">
            <span className="font-semibold">₹{listing.price}</span>
            <span className="text-sm text-gray-600"> / night</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;
