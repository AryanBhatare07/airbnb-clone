import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import Listing from "../models/listing.model.js";
import mongoose from "mongoose";

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      !Number.isInteger(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.guest.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot review this booking",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can review only completed stays",
      });
    }

    const existingReview = await Review.findOne({
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    const review = await Review.create({
      listing: booking.listing,
      user: req.userId,
      booking: bookingId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.isValidObjectId(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const reviews = await Review.find({ listing: listingId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    const summary = await Review.aggregate([
      {
        $match: {
          listing: listing._id,
        },
      },
      {
        $group: {
          _id: "$listing",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);
    const averageRating = summary.length
      ? Number(summary[0].averageRating.toFixed(1))
      : 0;
    const totalReviews = summary.length ? summary[0].totalReviews : 0;
    return res.status(200).json({
      success: true,
      averageRating,
      totalReviews,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
