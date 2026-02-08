import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// 1. TOGGLE SUBSCRIPTION
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID");
    }

    // A user cannot subscribe to their own channel
    if (channelId.toString() === req.user?._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    // Check if subscription already exists
    const credentials = { subscriber: req.user?._id, channel: channelId };
    const subscribed = await Subscription.findOne(credentials);

    if (subscribed) {
        // If exists, unsubscribe (remove document)
        await Subscription.deleteOne(credentials);
        return res.status(200).json(
            new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
        );
    }

    // If not exists, subscribe (create document)
    await Subscription.create(credentials);
    return res.status(200).json(
        new ApiResponse(200, { subscribed: true }, "Subscribed successfully")
    );
});

// 2. GET SUBSCRIBERS LIST (Who is following this channel?)
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber ID");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails",
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
            $unwind: "$subscriberDetails"
        },
        {
            $project: {
                _id: 1,
                subscriberDetails: 1,
                createdAt: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// 3. GET SUBSCRIBED CHANNELS (Who is this user following?)
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID");
    }

    const subscribedTo = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannel",
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
            $unwind: "$subscribedChannel"
        },
        {
            $project: {
                _id: 1,
                subscribedChannel: 1,
                createdAt: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, subscribedTo, "Subscribed channels fetched successfully")
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}