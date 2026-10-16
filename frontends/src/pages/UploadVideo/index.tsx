import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useBlocker } from "react-router";
import { toast } from "react-toastify";
import { toHttpError } from "../../api/api.helper";
import { videoService } from "../../api/services/video.service";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import TextAreaField from "../../components/ui/TextAreaField";
import type { Video } from "../../types/video.types";
import { hasErrors, validateImage, validateVideo } from "../../utils/validation.helper";
import ThumbnailField from "./ThumbnailField";
import UploadProgress from "./UploadProgress";
import UploadSuccess from "./UploadSuccess";
import {
  captureVideoFrame,
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  titleFromFileName,
  toServerFieldErrors,
  toUploadVideoRequest,
  UPLOAD_VIDEO_INITIAL_VALUES,
  validateUploadVideo,
  type UploadVideoFormErrors,
  type UploadVideoFormValues,
} from "./uploadVideo.helper";
import styles from "./UploadVideo.module.css";
import VideoDropzone from "./VideoDropzone";
import VideoPreview from "./VideoPreview";

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "done"; video: Video };

const VISIBILITY_OPTIONS = [
  { value: true, label: "Public", description: "Everyone can watch your video" },
  { value: false, label: "Draft", description: "Only you can see it until you publish" },
] as const;

export default function UploadVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [values, setValues] = useState<UploadVideoFormValues>(UPLOAD_VIDEO_INITIAL_VALUES);
  const [errors, setErrors] = useState<UploadVideoFormErrors>({});
  const [duration, setDuration] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });

  const isUploading = upload.status === "uploading";
  const isProcessing = isUploading && upload.progress >= 100;
  // Protect a picked video or a running upload from accidental navigation
  const hasUnsavedWork = isUploading || (upload.status === "idle" && values.videoFile !== null);

  // Cancel the request if the user leaves mid-upload
  useEffect(() => () => abortRef.current?.abort(), []);

  // Browser close / reload
  useEffect(() => {
    if (!hasUnsavedWork) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedWork]);

  // In-app navigation (sidebar, back button)
  const blocker = useBlocker(hasUnsavedWork);
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    const message = isUploading
      ? "Your video is still uploading. Leave and cancel the upload?"
      : "Discard this video? Your changes will be lost.";
    if (window.confirm(message)) blocker.proceed();
    else blocker.reset();
  }, [blocker, isUploading]);

  const handleVideoSelect = (file: File) => {
    const error = validateVideo(file);
    setErrors((prev) => ({ ...prev, videoFile: error }));
    if (error) return;

    setDuration(null);
    setValues((prev) => ({ ...prev, videoFile: file, title: prev.title || titleFromFileName(file.name) }));
    setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validated immediately so a bad image never replaces a good one
  const handleThumbnailChange = (file: File) => {
    const error = validateImage(file, true);
    setErrors((prev) => ({ ...prev, thumbnail: error }));
    if (!error) setValues((prev) => ({ ...prev, thumbnail: file }));
  };

  const handleCaptureFrame = async () => {
    if (!videoRef.current) return;
    setIsCapturing(true);
    const file = await captureVideoFrame(videoRef.current);
    setIsCapturing(false);

    if (file) handleThumbnailChange(file);
    else toast.error("Couldn't grab that frame. Play the video for a moment and try again.");
  };

  const resetForm = () => {
    setValues(UPLOAD_VIDEO_INITIAL_VALUES);
    setErrors({});
    setDuration(null);
    setUpload({ status: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateUploadVideo(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setUpload({ status: "uploading", progress: 0 });

    try {
      const video = await videoService.upload(toUploadVideoRequest(values), {
        signal: controller.signal,
        onProgress: (progress) => setUpload({ status: "uploading", progress }),
      });
      setUpload({ status: "done", video });
      toast.success("Video uploaded successfully.");
    } catch (error) {
      setUpload({ status: "idle" });
      if (controller.signal.aborted) {
        toast.info("Upload cancelled.");
        return;
      }
      const httpError = toHttpError(error);
      setErrors(toServerFieldErrors(httpError.errors));
      toast.error(httpError.message);
    } finally {
      abortRef.current = null;
    }
  };

  if (upload.status === "done") {
    return <UploadSuccess video={upload.video} onUploadAnother={resetForm} />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Upload video</h1>
        <p className={styles.subtitle}>Share something new with your audience.</p>
      </header>

      {!values.videoFile ? (
        <section className={styles.card}>
          <VideoDropzone onSelect={handleVideoSelect} error={errors.videoFile} />
        </section>
      ) : (
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
          {/* Disabling the fieldset locks every field while the upload runs */}
          <fieldset className={styles.fieldset} disabled={isUploading}>
            <legend className="sr-only">Video details</legend>
            <div className={styles.layout}>
              <div className={styles.details}>
                <InputField
                  label="Title"
                  name="title"
                  placeholder="Add a title that describes your video"
                  value={values.title}
                  onChange={handleChange}
                  error={errors.title}
                  maxLength={TITLE_MAX_LENGTH}
                  hint={`${values.title.length}/${TITLE_MAX_LENGTH}`}
                  autoFocus
                />
                <TextAreaField
                  label="Description"
                  name="description"
                  placeholder="Tell viewers about your video"
                  value={values.description}
                  onChange={handleChange}
                  error={errors.description}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  rows={7}
                />

                <fieldset className={styles.visibility}>
                  <legend className={styles.sectionLabel}>Visibility</legend>
                  <div className={styles.visibilityOptions}>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <label
                        key={option.label}
                        className={`${styles.option} ${values.isPublished === option.value ? styles.optionActive : ""}`}
                      >
                        <input
                          type="radio"
                          name="isPublished"
                          className={styles.optionRadio}
                          checked={values.isPublished === option.value}
                          onChange={() => setValues((prev) => ({ ...prev, isPublished: option.value }))}
                        />
                        <span>
                          <span className={styles.optionLabel}>{option.label}</span>
                          <span className={styles.optionText}>{option.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <aside className={styles.side}>
                <VideoPreview
                  file={values.videoFile}
                  videoRef={videoRef}
                  duration={duration}
                  onReady={setDuration}
                  onReplace={handleVideoSelect}
                  error={errors.videoFile}
                />
                <ThumbnailField
                  file={values.thumbnail}
                  onFileChange={handleThumbnailChange}
                  onCaptureFrame={handleCaptureFrame}
                  canCapture={duration !== null}
                  isCapturing={isCapturing}
                  error={errors.thumbnail}
                />
              </aside>
            </div>
          </fieldset>

          <footer className={styles.footer}>
            {isUploading ? (
              <UploadProgress progress={upload.progress} totalBytes={values.videoFile.size} />
            ) : (
              <span className={styles.footerNote}>
                {values.isPublished ? "Will be public once uploaded." : "Will be saved as a draft."}
              </span>
            )}
            <div className={styles.actions}>
              {isUploading ? (
                // Once the bytes are sent the server finishes anyway, so cancelling would mislead
                <Button variant="secondary" onClick={() => abortRef.current?.abort()} disabled={isProcessing}>
                  Cancel upload
                </Button>
              ) : (
                <Button variant="secondary" onClick={resetForm}>
                  Discard
                </Button>
              )}
              <Button type="submit" isLoading={isUploading}>
                {isUploading ? (isProcessing ? "Processing…" : "Uploading…") : "Upload video"}
              </Button>
            </div>
          </footer>
        </form>
      )}
    </div>
  );
}
