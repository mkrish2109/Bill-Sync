import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../../helper/apiHelper";
import LoadingSpinner from "../common/LoadingSpinner";

const ImageUploader = (
  { onImageUpload, initialImageUrl = "", className = "", onDelete },
  ref
) => {
  const [preview, setPreview] = useState(initialImageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [tempFile, setTempFile] = useState(null);

  // Set initial preview when initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const deleteImage = async (filename) => {
    try {
      const response = await api.delete(`/upload/${filename}`);
      if (!response.data.success) {
        console.error("Failed to delete image");
      }
      setPreview("");
      setTempFile(null);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError("");
    setTempFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  }, []);

  // Function to handle actual upload
  const handleUpload = async () => {
    if (!tempFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", tempFile);

      const response = await api.post("/upload", formData);
      if (!response.data.success) {
        throw new Error(response.data.error || "Upload failed");
      }

      const data = response.data;
      if (data.success && data.imageUrl) {
        onImageUpload(data.imageUrl);
        setTempFile(null);
        return data.imageUrl;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image. Please try again.");
      setPreview(initialImageUrl);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  // Expose handleUpload to parent component
  React.useImperativeHandle(ref, () => ({
    handleUpload,
  }));

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
          }
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {uploading ? (
              <LoadingSpinner inline text="Uploading..." />
            ) : isDragActive ? (
              <p>Drop the image here</p>
            ) : (
              <p>
                Drag and drop an image here, or click to select
                <br />
                <span className="text-xs">
                  (Max size: 5MB, Supported formats: JPG, PNG, GIF, WebP)
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-contain bg-gray-50 dark:bg-gray-800"
            onError={(e) => {
              console.error("Image load error:", e);
              setError("Failed to load image preview");
            }}
          />
          <button
            onClick={() => deleteImage(preview.split("/").pop())}
            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200"
            title="Delete image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(ImageUploader);
