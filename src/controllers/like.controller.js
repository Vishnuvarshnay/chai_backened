import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// 1. TOGGLE VIDEO LIKE
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }

    const likedAlready = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id)
        return res.status(200).json(new ApiResponse(200, { isLiked: false }))
    }

    await Like.create({
        video: videoId,
        likedBy: req.user?._id
    })

    return res.status(200).json(new ApiResponse(200, { isLiked: true }))
})

// 2. TOGGLE COMMENT LIKE
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID")
    }

    const likedAlready = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id)
        return res.status(200).json(new ApiResponse(200, { isLiked: false }))
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    })

    return res.status(200).json(new ApiResponse(200, { isLiked: true }))
})

// 3. TOGGLE TWEET LIKE
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }

    const likedAlready = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id)
        return res.status(200).json(new ApiResponse(200, { isLiked: false }))
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    return res.status(200).json(new ApiResponse(200, { isLiked: true }))
})

// 4. GET ALL LIKED VIDEOS
const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideosAggregate = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            ownerDetails: { $first: "$ownerDetails" }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $project: {
                _id: 1,
                videoDetails: 1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, likedVideosAggregate, "Liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}