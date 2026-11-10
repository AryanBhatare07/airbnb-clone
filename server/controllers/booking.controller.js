import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";

export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    if (!listingId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime()) ||
      endDate <= startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking dates",
      });
    }

    if (
      !Number.isInteger(Number(guests)) ||
      Number(guests) < 1 ||
      Number(guests) > listing.maxGuests
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid number of guests",
      });
    }

    if (listing.host.toString() === req.userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot book your own listing",
      });
    }

    const existingBooking = await Booking.findOne({
      listing: listingId,
      status: "confirmed",
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "Property is already booked for these dates",
      });
    }

    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const totalPrice = nights * listing.price;

    const booking = await Booking.create({
      listing: listingId,
      guest: req.userId,
      checkIn: startDate,
      checkOut: endDate,
      guests: Number(guests),
      totalPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      guest: req.userId,
    })
      .populate({
        path: "listing",
        select: "title images price location country",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.guest.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getHostBookings = async (req, res) => {
  try {
    const listings = await Listing.find({
      host: req.userId,
    }).select("_id");

    const listingIds = listings.map((listing) => listing._id);

    const bookings = await Booking.find({
      listing: { $in: listingIds },
    })
      .populate("listing", "title images price location")
      .populate("guest", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Host Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
