import { useState } from "react";
import { Link } from "react-router-dom";

function ListingCard({ listing }) {
  const [currentImage, setCurrentImage] = useState(0);

  const images = listing.images?.length
    ? listing.images
    : ["https://placehold.co/600x400?text=No+Image"];

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link to={`/listings/${listing._id}`} className="block group">
      <div className="cursor-pointer">
        {/* Property Image Slider */}
        <div className="relative w-full h-52 overflow-hidden rounded-xl bg-gray-100">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(-${(currentImage * 100) / images.length}%)`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="h-full shrink-0"
                style={{ width: `${100 / images.length}%` }}
              >
                <img
                  src={image}
                  alt={`${listing.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-8 h-8 shadow flex items-center justify-center"
              >
                &#10094;
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-8 h-8 shadow flex items-center justify-center"
              >
                &#10095;
              </button>
            </>
          )}

          {/* Image Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    currentImage === index
                      ? "bg-white scale-125"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
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
