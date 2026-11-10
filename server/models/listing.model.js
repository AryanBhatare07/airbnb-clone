import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    location: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    coordinates: {
      lat: Number,
      lng: Number,
    },

    category: {
      type: String,
      enum: [
        "Beach",
        "Mountains",
        "City",
        "Countryside",
        "Amazing Views",
        "Cabins",
        "Luxury",
      ],
      required: true,
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },

    bedrooms: {
      type: Number,
      required: true,
      min: 1,
    },

    bathrooms: {
      type: Number,
      required: true,
      min: 1,
    },

    amenities: [
      {
        type: String,
      },
    ],

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
