import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../api/api.helper";
import { videoService } from "../../api/services/video.service";
import { SearchIcon } from "../../components/ProfileMenu/icons";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import PageLoader from "../../components/ui/PageLoader";
import { ROUTES } from "../../constants/route.constant";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changeAvatar, changeCoverImage, fetchDashboard, selectUser } from "../../store/slices/auth.slice";
import { useObjectUrl } from "../../hooks/useObjectUrl";
import type { Video } from "../../types/video.types";
import { formatDate, getInitials } from "../../utils/format.helper";
import { validateImage } from "../../utils/validation.helper";
import VideoCard, { VideoCardSkeleton } from "../MyVideos/VideoCard";
import VideoPlayerDialog from "../MyVideos/VideoPlayerDialog";
import {
  CHANNEL_TABS,
  EMPTY_TAB_TEXT,
  getChannelMeta,
  getChannelVideos,
  HOME_SHELF_SIZE,
  matchesQuery,
  SKELETON_COUNT,
  type ChannelTab,
} from "./dashboard.helper";
import ImageEditButton from "./ImageEditButton";
import styles from "./Dashboard.module.css";

type VideosState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; videos: Video[] };

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [error, setError] = useState("");

  const [videosState, setVideosState] = useState<VideosState>({ status: "loading" });
  const [tab, setTab] = useState<ChannelTab>("home");
  const [playing, setPlaying] = useState<Video | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Bumped by "Try again" to re-run the videos fetch
  const [attempt, setAttempt] = useState(0);

  // Files being uploaded; previewed in place of the saved images until the request settles
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const avatarPreview = useObjectUrl(avatarFile);
  const coverPreview = useObjectUrl(coverFile);

  const uploadImage = async (
    file: File,
    setFile: (file: File | null) => void,
    upload: typeof changeAvatar | typeof changeCoverImage,
    successText: string,
  ) => {
    const validationError = validateImage(file, true);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setFile(file);
    try {
      await dispatch(upload(file)).unwrap();
      toast.success(successText);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      // Store now holds the saved URL (or the old one on failure)
      setFile(null);
    }
  };

  // Cached user renders immediately; the API response replaces it with fresh data
  useEffect(() => {
    const request = dispatch(fetchDashboard());
    request.unwrap().catch((err) => {
      if (err?.name === "AbortError") return;
      const message = getErrorMessage(err);
      // Only used when there's no cached user to show; otherwise the toast is enough
      setError(message);
      toast.error(message);
    });
    return () => request.abort();
  }, [dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    videoService
      .getMyVideos(controller.signal)
      .then((videos) => setVideosState({ status: "ready", videos: getChannelVideos(videos) }))
      .catch((err) => {
        if (!controller.signal.aborted) setVideosState({ status: "error", message: getErrorMessage(err) });
      });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  if (!user) return error ? <Alert>{error}</Alert> : <PageLoader />;

  const avatarSrc = avatarPreview ?? user.avatar;
  const coverSrc = coverPreview ?? user.coverImage;
  const videos = videosState.status === "ready" ? videosState.videos : [];
  const videoCount = videosState.status === "ready" ? videos.length : null;
  const isSearching = query.trim() !== "";

  const closeSearch = () => {
    setIsSearchOpen(false);
    setQuery("");
  };

  const selectTab = (value: ChannelTab) => {
    closeSearch();
    setTab(value);
  };

  const retryVideos = () => {
    setVideosState({ status: "loading" });
    setAttempt((n) => n + 1);
  };

  const renderVideoGrid = (list: Video[], emptyText: string) => {
    if (videosState.status === "loading") {
      return (
        <div className={styles.grid} aria-busy="true" aria-label="Loading videos">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (videosState.status === "error") {
      return (
        <div className={styles.errorBox}>
          <Alert>{videosState.message}</Alert>
          <Button variant="secondary" onClick={retryVideos}>
            Try again
          </Button>
        </div>
      );
    }
    if (list.length === 0) return <p className={styles.emptyText}>{emptyText}</p>;
    return (
      <div className={styles.grid}>
        {list.map((video) => (
          <VideoCard key={video._id} video={video} onPlay={setPlaying} />
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    if (isSearching) {
      return (
        <section>
          <h2 className={styles.shelfTitle}>Results for “{query.trim()}”</h2>
          {renderVideoGrid(
            videos.filter((video) => matchesQuery(video, query)),
            "This channel has no videos that match your search.",
          )}
        </section>
      );
    }

    switch (tab) {
      case "home":
        return (
          <section>
            <h2 className={styles.shelfTitle}>For you</h2>
            {renderVideoGrid(videos.slice(0, HOME_SHELF_SIZE), "Upload a video to get your channel started.")}
          </section>
        );
      case "videos":
        return renderVideoGrid(videos, "This channel has no videos yet.");
      default:
        return <p className={styles.emptyText}>{EMPTY_TAB_TEXT[tab]}</p>;
    }
  };

  return (
    <div className={styles.page}>
      {coverSrc && (
        <div className={styles.banner} style={{ backgroundImage: `url(${coverSrc})` }}>
          <ImageEditButton
            label="Change banner image"
            className={styles.bannerEdit}
            isLoading={Boolean(coverFile)}
            onSelect={(file) => uploadImage(file, setCoverFile, changeCoverImage, "Banner updated.")}
          />
        </div>
      )}

      <header className={styles.channelHeader}>
        <div className={styles.avatarWrap}>
          {avatarSrc ? (
            <img src={avatarSrc} alt={`${user.fullName}'s avatar`} className={styles.avatar} />
          ) : (
            <span className={styles.avatar}>{getInitials(user.fullName)}</span>
          )}
          <ImageEditButton
            label="Change avatar"
            className={styles.avatarEdit}
            isLoading={Boolean(avatarFile)}
            onSelect={(file) => uploadImage(file, setAvatarFile, changeAvatar, "Avatar updated.")}
          />
        </div>

        <div className={styles.channelInfo}>
          <h1 className={styles.name}>{user.fullName}</h1>
          <p className={styles.meta}>
            <span className={styles.handle}>@{user.userName}</span>
            {" • "}
            {getChannelMeta(user.subscribersCount ?? 0, videoCount)}
          </p>
          <p className={styles.meta}>Joined {formatDate(user.createdAt)}</p>

          <div className={styles.actions}>
            <Link to={ROUTES.EDIT_PROFILE} className={styles.pill}>
              Customise channel
            </Link>
            <Link to={ROUTES.MY_VIDEOS} className={styles.pill}>
              Manage videos
            </Link>
            {!coverSrc && (
              <ImageEditButton
                label="Add banner image"
                className={styles.pillIcon}
                isLoading={Boolean(coverFile)}
                onSelect={(file) => uploadImage(file, setCoverFile, changeCoverImage, "Banner added.")}
              />
            )}
          </div>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Channel sections">
        <div role="tablist" className={styles.tabList}>
          {CHANNEL_TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={!isSearching && tab === value}
              className={`${styles.tab} ${!isSearching && tab === value ? styles.tabActive : ""}`}
              onClick={() => selectTab(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {isSearchOpen ? (
          <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
            <SearchIcon />
            <input
              ref={searchInputRef}
              type="search"
              className={styles.searchInput}
              placeholder="Search"
              aria-label="Search this channel"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Escape" && closeSearch()}
              onBlur={() => !query.trim() && setIsSearchOpen(false)}
            />
          </form>
        ) : (
          <button
            type="button"
            className={styles.searchButton}
            aria-label="Search this channel"
            onClick={() => setIsSearchOpen(true)}
          >
            <SearchIcon />
          </button>
        )}
      </nav>

      <div className={styles.content}>{renderTabContent()}</div>

      <VideoPlayerDialog video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
