import cloudinary from "../config/cloudinary.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";

const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "airbnb-listings",
        resource_type: "image",
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      },
    );

    stream.end(fileBuffer);
  });
};

export const getAllListings = async (req, res) => {
  try {
    const {
      search,
      location,
      category,
      minPrice,
      maxPrice,
      guests,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (guests) {
      filter.maxGuests = {
        $gte: Number(guests),
      };
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    const totalListings = await Listing.countDocuments(filter);

    const listings = await Listing.find(filter)
      .populate("host", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalListings / limitNumber),
        totalListings,
        hasNextPage: pageNumber * limitNumber < totalListings,
        hasPrevPage: pageNumber > 1,
      },
      listings,
    });
  } catch (error) {
    console.error("Get Listings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("host", "name avatar");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    return res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("Get Listing Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      country,
      coordinates,
      category,
      maxGuests,
      bedrooms,
      bathrooms,
      amenities,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !country ||
      !category ||
      !maxGuests ||
      !bedrooms ||
      !bathrooms
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "host") {
      return res.status(403).json({
        success: false,
        message: "Only hosts can create listings",
      });
    }

    // Upload images to Cloudinary
    const files = req.files || [];

    const imageUrls = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file.buffer)),
    );

    const parsedCoordinates =
      typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;

    const parsedAmenities =
      typeof amenities === "string" ? JSON.parse(amenities) : amenities || [];

    const listing = await Listing.create({
      title,
      description,
      images: imageUrls,
      price: Number(price),
      location,
      country,
      coordinates: parsedCoordinates,
      category,
      maxGuests: Number(maxGuests),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      amenities: parsedAmenities,
      host: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create Listing Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.host.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this listing",
      });
    }

    const {
      title,
      description,
      price,
      location,
      country,
      coordinates,
      category,
      maxGuests,
      bedrooms,
      bathrooms,
      amenities,
      existingImages,
    } = req.body;

    const files = req.files || [];

    if (files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 new images are allowed",
      });
    }

    const newImageUrls = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file.buffer)),
    );

    const allowedFields = [
      "title",
      "description",
      "price",
      "location",
      "country",
      "coordinates",
      "category",
      "maxGuests",
      "bedrooms",
      "bathrooms",
      "amenities",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "coordinates") {
          listing.coordinates =
            typeof req.body.coordinates === "string"
              ? JSON.parse(req.body.coordinates)
              : req.body.coordinates;
        } else if (field === "amenities") {
          listing.amenities =
            typeof req.body.amenities === "string"
              ? JSON.parse(req.body.amenities)
              : req.body.amenities;
        } else {
          listing[field] = req.body[field];
        }
      }
    });

    if (coordinates !== undefined) {
      listing.coordinates =
        typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
    }

    if (amenities !== undefined) {
      listing.amenities =
        typeof amenities === "string" ? JSON.parse(amenities) : amenities;
    }

    if (existingImages !== undefined) {
      listing.images =
        typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;
    }

    listing.images = [...listing.images, ...newImageUrls];

    await listing.save();

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("Update Listing Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update listing",
    });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    if (listing.host.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this listing",
      });
    }
    await Listing.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete Listing Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      host: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Get My Listings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
