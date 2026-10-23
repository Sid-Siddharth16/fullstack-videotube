import mongoose from "mongoose";

const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user cannot subscribe to the same channel twice.
// Also serves queries by `subscriber` alone (leftmost prefix).
subscriptionSchema.index(
  { subscriber: 1, channel: 1 },
  { unique: true }
);

// Efficiently retrieve a channel's subscribers; also serves queries by `channel` alone.
subscriptionSchema.index({ channel: 1, createdAt: -1 });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);