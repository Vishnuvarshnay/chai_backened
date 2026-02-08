import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// 1. CREATE TWEET
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });

    if (!tweet) {
        throw new ApiError(500, "Failed to create tweet, please try again");
    }

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    );
});

// 2. GET USER TWEETS
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    // Using aggregation to fetch tweets and potentially join with user info
    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1 // Newest tweets first
            }
        },
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
                            avatar: 1,
                            fullName: 1
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
    ]);

    return res.status(200).json(
        new ApiResponse(200, tweets, "User tweets fetched successfully")
    );
});

// 3. UPDATE TWEET
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required to update tweet");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Authorization: Only owner can update
    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this tweet");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: { content }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    );
});

// 4. DELETE TWEET
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Authorization: Only owner can delete
    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    );
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}