import { useEffect, useMemo } from "react";

// Temporary blob URL for previewing a local file; revoked when the file changes or on unmount
export const useObjectUrl = (file: File | null) => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return url;
};
