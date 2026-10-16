import { useRef, type ChangeEvent } from "react";
import { PencilIcon } from "../../components/ProfileMenu/icons";
import Spinner from "../../components/ui/Spinner";
import styles from "./Dashboard.module.css";

interface ImageEditButtonProps {
  label: string;
  onSelect: (file: File) => void;
  isLoading?: boolean;
  className?: string;
}

// Pencil button that opens the native file picker for a single image
export default function ImageEditButton({ label, onSelect, isLoading = false, className = "" }: ImageEditButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file again still fires onChange
    event.target.value = "";
    if (file) onSelect(file);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.pencilButton} ${className}`}
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-label={label}
        title={label}
      >
        {isLoading ? <Spinner size={16} label="Uploading" /> : <PencilIcon />}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={handleChange} />
    </>
  );
}
