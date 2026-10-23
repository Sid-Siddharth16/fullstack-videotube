import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getErrorMessage } from "../../api/api.helper";
import { subscriptionService } from "../../api/services/subscription.service";
import { videoService } from "../../api/services/video.service";
import { SubscriptionsIcon } from "../../components/Sidebar/icons";
import SubscribeButton from "../../components/SubscribeButton";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { channelPath } from "../../constants/route.constant";
import type { ToggleSubscriptionResponse } from "../../types/subscription.types";
import type { DiscoverChannel } from "../../types/user.types";
import type { FeedVideo } from "../../types/video.types";
import { formatCount, getInitials } from "../../utils/format.helper";
import VideoCard, { VideoCardSkeleton } from "../MyVideos/VideoCard";
import VideoPlayerDialog from "../MyVideos/VideoPlayerDialog";
import styles from "./Home.module.css";

type LoadState<T> = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: T };

const SKELETON_COUNT = 8;

export default function HomePage() {
  const [channels, setChannels] = useState<LoadState<DiscoverChannel[]>>({ status: "loading" });
  const [feed, setFeed] = useState<LoadState<FeedVideo[]>>({ status: "loading" });
  const [playing, setPlaying] = useState<FeedVideo | null>(null);
  // Bumped by "Try again" and by (un)subscribing, to refetch the feed
  const [feedVersion, setFeedVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    subscriptionService
      .getDiscover(controller.signal)
      .then((data) => setChannels({ status: "ready", data }))
      .catch((err) => {
        if (!controller.signal.aborted) setChannels({ status: "error", message: getErrorMessage(err) });
      });
    return () => controller.abort();
  }, []);

  // Refetches keep the current feed on screen instead of flashing skeletons
  useEffect(() => {
    const controller = new AbortController();
    videoService
      .getFeed(controller.signal)
      .then((data) => setFeed({ status: "ready", data }))
      .catch((err) => {
        if (!controller.signal.aborted) setFeed({ status: "error", message: getErrorMessage(err) });
      });
    return () => controller.abort();
  }, [feedVersion]);

  const retryFeed = () => {
    setFeed({ status: "loading" });
    setFeedVersion((n) => n + 1);
  };

  const handleSubscriptionChange = (channelId: string, result: ToggleSubscriptionResponse) => {
    setChannels((prev) =>
      prev.status === "ready"
        ? {
            status: "ready",
            data: prev.data.map((channel) => (channel._id === channelId ? { ...channel, ...result } : channel)),
          }
        : prev,
    );
    setFeedVersion((n) => n + 1);
  };

  return (
    <div className={styles.page}>
      {channels.status === "error" && <Alert>{channels.message}</Alert>}

      {channels.status === "ready" && channels.data.length > 0 && (
        <section aria-labelledby="discover-title">
          <h2 id="discover-title" className={styles.sectionTitle}>
            Channels to discover
          </h2>
          <ul className={styles.channelRow}>
            {channels.data.map((channel) => (
              <li key={channel._id} className={styles.channelCard}>
                <Link to={channelPath(channel.userName)} className={styles.channelLink}>
                  {channel.avatar ? (
                    <img src={channel.avatar} alt="" className={styles.channelAvatar} loading="lazy" />
                  ) : (
                    <span className={styles.channelAvatar}>{getInitials(channel.fullName)}</span>
                  )}
                  <span className={styles.channelName} title={channel.fullName}>
                    {channel.fullName}
                  </span>
                  <span className={styles.channelMeta}>
                    {formatCount(channel.subscribersCount)}{" "}
                    {channel.subscribersCount === 1 ? "subscriber" : "subscribers"}
                  </span>
                </Link>
                <SubscribeButton
                  channelId={channel._id}
                  isSubscribed={channel.isSubscribed}
                  onChange={(result) => handleSubscriptionChange(channel._id, result)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="feed-title">
        <h2 id="feed-title" className={styles.sectionTitle}>
          From your subscriptions
        </h2>

        {feed.status === "error" && (
          <div className={styles.errorBox}>
            <Alert>{feed.message}</Alert>
            <Button variant="secondary" onClick={retryFeed}>
              Try again
            </Button>
          </div>
        )}

        {feed.status === "loading" && (
          <div className={styles.grid} aria-busy="true" aria-label="Loading videos">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        )}

        {feed.status === "ready" && feed.data.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <SubscriptionsIcon />
            </span>
            <h3 className={styles.emptyTitle}>No videos yet</h3>
            <p className={styles.emptyText}>Subscribe to channels to see their videos here.</p>
          </div>
        )}

        {feed.status === "ready" && feed.data.length > 0 && (
          <div className={styles.grid}>
            {feed.data.map((video) => (
              <VideoCard key={video._id} video={video} owner={video.owner} onPlay={setPlaying} />
            ))}
          </div>
        )}
      </section>

      <VideoPlayerDialog video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
