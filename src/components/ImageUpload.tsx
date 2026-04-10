import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, ImagePlus, Check } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete?: (imageUrl: string) => void;
  onMultipleUploadComplete?: (imageUrls: string[]) => void;
  maxImages?: number;
  currentImages?: string[];
  onDeleteImage?: (imageUrl: string) => void;
}

const ImageUpload = ({
  onUploadComplete,
  onMultipleUploadComplete,
  maxImages = 10,
  currentImages = [],
  onDeleteImage,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>(currentImages);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      console.log(`Uploading to: ${apiUrl}/upload/upload`);
      
      const response = await fetch(`${apiUrl}/upload/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server upload error:", errorData);
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      const imageUrl = data.image.url;

      setUploadedImages((prev) => [...prev, imageUrl]);
      setProgress(100);

      if (onUploadComplete) {
        onUploadComplete(imageUrl);
      }

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      setProgress(0);
      throw error;
    }
  };

  const uploadMultipleImages = async (files: FileList | File[]) => {
    const filesArray = Array.from(files).slice(0, maxImages - uploadedImages.length);
    
    if (filesArray.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      try {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
        setProgress(((i + 1) / filesArray.length) * 100);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    if (uploadedUrls.length > 0 && onMultipleUploadComplete) {
      onMultipleUploadComplete(uploadedUrls);
    }

    setUploading(false);
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadMultipleImages(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadMultipleImages(e.target.files);
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    setUploadedImages((prev) => prev.filter((img) => img !== imageUrl));
    if (onDeleteImage) {
      onDeleteImage(imageUrl);
    }
  };

  const canUploadMore = uploadedImages.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            dragActive
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />

          <AnimatePresence>
            {uploading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            ) : (
              <label
                htmlFor="file-upload"
                className="cursor-pointer block space-y-3"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Drop images here or{" "}
                      <span className="text-primary hover:underline cursor-pointer">
                        browse
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP up to 5MB each
                    </p>
                  </div>
                </motion.div>
              </label>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <motion.div
              key={imageUrl}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border"
            >
              <img
                src={imageUrl}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleDeleteImage(imageUrl)}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Success Indicator */}
              <div className="absolute bottom-2 left-2 p-1 bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Check className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {uploadedImages.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {uploadedImages.length} / {maxImages} images uploaded
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
