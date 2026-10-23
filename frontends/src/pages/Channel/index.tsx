import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toHttpError } from "../../api/api.helper";
import { userService } from "../../api/services/user.service";
import { videoService } from "../../api/services/video.service";
import SubscribeButton from "../../components/SubscribeButton";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import PageLoader from "../../components/ui/PageLoader";
import { HTTP_STATUS } from "../../constants/http.constant";
import { ROUTES } from "../../constants/route.constant";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/auth.slice";
import type { ChannelProfile } from "../../types/user.types";
import type { Video } from "../../types/video.types";
import { getInitials } from "../../utils/format.helper";
import { getChannelMeta } from "../Dashboard/dashboard.helper";
import VideoCard from "../MyVideos/VideoCard";
import VideoPlayerDialog from "../MyVideos/VideoPlayerDialog";
import styles from "../Dashboard/Dashboard.module.css";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string; notFound: boolean }
  | { status: "ready"; channel: ChannelProfile; videos: Video[] };

// Keyed by userName so moving between channels starts from a fresh loading state
export default function ChannelPage() {
  const { userName = "" } = useParams();
  return <ChannelView key={userName} userName={userName} />;
}

function ChannelView({ userName }: { userName: string }) {
  const viewer = useAppSelector(selectUser);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [playing, setPlaying] = useState<Video | null>(null);
  // Bumped by "Try again" to re-run the fetch effect
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      userService.getChannelProfile(userName, controller.signal),
      videoService.getChannelVideos(userName, controller.signal),
    ])
      .then(([channel, videos]) => setState({ status: "ready", channel, videos }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        const { status, message } = toHttpError(err);
        setState({ status: "error", message, notFound: status === HTTP_STATUS.NOT_FOUND });
      });
    return () => controller.abort();
  }, [userName, attempt]);

  const retry = () => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  };

  if (state.status === "loading") return <PageLoader />;

  if (state.status === "error") {
    return (
      <div className={styles.errorBox}>
        <Alert>{state.notFound ? "Channel not found." : state.message}</Alert>
        {!state.notFound && (
          <Button variant="secondary" onClick={retry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  const { channel, videos } = state;
  const isOwnChannel = viewer?._id === channel._id;

  return (
    <div className={styles.page}>
      {channel.coverImage && (
        <div className={styles.banner} style={{ backgroundImage: `url(${channel.coverImage})` }} />
      )}

      <header className={styles.channelHeader}>
        <div className={styles.avatarWrap}>
          {channel.avatar ? (
            <img src={channel.avatar} alt={`${channel.fullName}'s avatar`} className={styles.avatar} />
          ) : (
            <span className={styles.avatar}>{getInitials(channel.fullName)}</span>
          )}
        </div>

        <div className={styles.channelInfo}>
          <h1 className={styles.name}>{channel.fullName}</h1>
          <p className={styles.meta}>
            <span className={styles.handle}>@{channel.userName}</span>
            {" • "}
            {getChannelMeta(channel.subscribersCount, videos.length)}
          </p>

          <div className={styles.actions}>
            {isOwnChannel ? (
              <Link to={ROUTES.PROFILE} className={styles.pill}>
                Manage channel
              </Link>
            ) : (
              <SubscribeButton
                channelId={channel._id}
                isSubscribed={channel.isSubscribed}
                onChange={(result) =>
                  setState((prev) =>
                    prev.status === "ready" ? { ...prev, channel: { ...prev.channel, ...result } } : prev,
                  )
                }
              />
            )}
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <h2 className={styles.shelfTitle}>Videos</h2>
        {videos.length > 0 ? (
          <div className={styles.grid}>
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} onPlay={setPlaying} />
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>This channel has no videos yet.</p>
        )}
      </div>

      <VideoPlayerDialog video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
