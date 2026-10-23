import { useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../api/api.helper";
import { subscriptionService } from "../../api/services/subscription.service";
import type { ToggleSubscriptionResponse } from "../../types/subscription.types";
import Button from "../ui/Button";

interface SubscribeButtonProps {
  channelId: string;
  isSubscribed: boolean;
  onChange: (result: ToggleSubscriptionResponse) => void;
  className?: string;
}

export default function SubscribeButton({ channelId, isSubscribed, onChange, className }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      onChange(await subscriptionService.toggle(channelId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isSubscribed ? "secondary" : "primary"}
      isLoading={isLoading}
      aria-pressed={isSubscribed}
      className={className}
      onClick={handleClick}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
}
