import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";

const DISCOVER_LIMIT = 12;

// subscribe if not subscribed yet, unsubscribe otherwise
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriber = req.user._id;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    if (subscriber.equals(channelId)) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const channelExists = await User.exists({ _id: channelId });
    if (!channelExists) {
        throw new ApiError(404, "Channel not found");
    }

    const removed = await Subscription.findOneAndDelete({ subscriber, channel: channelId });

    if (!removed) {
        try {
            await Subscription.create({ subscriber, channel: channelId });
        } catch (error) {
            // duplicate key: a parallel request (double click) already subscribed
            if (error?.code !== 11000) throw error;
        }
    }

    const subscribersCount = await Subscription.countDocuments({ channel: channelId });

    return res.status(200).json(new ApiResponse(
        200,
        { isSubscribed: !removed, subscribersCount },
        removed ? "Unsubscribed successfully" : "Subscribed successfully"
    ));
});

// other channels for the home "discover" shelf, most subscribed first
const getDiscoverChannels = asyncHandler(async (req, res) => {
    const viewerId = req.user._id;

    const channels = await User.aggregate([
        { $match: { _id: { $ne: viewerId } } },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                pipeline: [{ $count: "count" }],
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                pipeline: [
                    { $match: { subscriber: viewerId } },
                    { $limit: 1 },
                    { $project: { _id: 1 } }
                ],
                as: "viewerSubscription"
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                avatar: 1,
                subscribersCount: { $ifNull: [{ $first: "$subscribers.count" }, 0] },
                isSubscribed: { $gt: [{ $size: "$viewerSubscription" }, 0] }
            }
        },
        { $sort: { subscribersCount: -1, _id: 1 } },
        { $limit: DISCOVER_LIMIT }
    ]);

    return res.status(200).json(new ApiResponse(200, channels, "Channels fetched successfully"));
});

export { toggleSubscription, getDiscoverChannels };
