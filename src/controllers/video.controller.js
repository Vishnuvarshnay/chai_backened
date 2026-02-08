import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// 1. GET ALL VIDEOS (with Pagination, Search, and Sort)
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
    
    const pipeline = [];

    // Search by title or description using regex
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        });
    }

    // Filter by specific user if userId is provided
    if (userId) {
        if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid User ID");
        pipeline.push({ $match: { owner: new mongoose.Types.ObjectId(userId) } });
    }

    // Only show published videos to the public
    pipeline.push({ $match: { isPublished: true } });

    // Sorting logic
    const direction = sortType === "desc" ? -1 : 1;
    pipeline.push({ $sort: { [sortBy]: direction } });

    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const videos = await Video.aggregatePaginate(videoAggregate, options);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

// 2. PUBLISH A VIDEO
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) throw new ApiError(400, "Title and description are required");

    // Local paths from Multer middleware
    const videoFileLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!videoFileLocalPath) throw new ApiError(400, "Video file is missing");
    if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is missing");

    // Upload to Cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) throw new ApiError(400, "Video upload failed");

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user?._id,
        isPublished: true
    });

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
});

// 3. GET VIDEO BY ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

    // Using aggregate to join with User model to get owner details
    const video = await Video.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { username: 1, avatar: 1, email: 1 } }
                ]
            }
        },
        { $addFields: { owner: { $first: "$owner" } } }
    ]);

    if (!video?.length) throw new ApiError(404, "Video not found");

    return res.status(200).json(
        new ApiResponse(200, video[0], "Video details fetched")
    );
});

// 4. UPDATE VIDEO
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

    if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    // Authorized check: Only owner can update
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized request");
    }

    const updateData = { title, description };

    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (thumbnail) updateData.thumbnail = thumbnail.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateData },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});

// 5. DELETE VIDEO
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    // Authorized check
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized request");
    }

    // TODO: You should also delete the files from Cloudinary here using public_id
    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    );
});

// 6. TOGGLE PUBLISH STATUS
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to toggle status");
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, { isPublished: video.isPublished }, "Publish status toggled")
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}