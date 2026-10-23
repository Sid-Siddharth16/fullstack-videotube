import type { ApiResponse } from "../../types/api.types";
import type { ToggleSubscriptionResponse } from "../../types/subscription.types";
import type { DiscoverChannel } from "../../types/user.types";
import { API_ENDPOINTS } from "../api.endpoints";
import axiosInstance from "../axios.instance";

export const subscriptionService = {
  // Subscribes, or unsubscribes when already subscribed
  async toggle(channelId: string) {
    const { data } = await axiosInstance.post<ApiResponse<ToggleSubscriptionResponse>>(
      API_ENDPOINTS.SUBSCRIPTIONS.TOGGLE(channelId),
    );
    return data.data;
  },

  async getDiscover(signal?: AbortSignal) {
    const { data } = await axiosInstance.get<ApiResponse<DiscoverChannel[]>>(API_ENDPOINTS.SUBSCRIPTIONS.DISCOVER, {
      signal,
    });
    return data.data;
  },
};
