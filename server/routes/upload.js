import express from "express";
import { upload, deleteImage } from "../utils/cloudinary.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Upload single image
router.post("/upload", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary error:", err);
      return res.status(500).json({ error: err.message || "Failed to upload to Cloudinary" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      res.json({
        success: true,
        image: {
          url: req.file.path,
          public_id: req.file.filename,
          width: req.file.width,
          height: req.file.height,
          format: req.file.format,
          size: req.file.size,
        },
      });
    } catch (error) {
      console.error("Internal processing error:", error);
      res.status(500).json({ error: "Failed to process uploaded image" });
    }
  });
});

// Upload multiple images
router.post(
  "/upload-multiple",
  upload.array("images", 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No image files provided" });
      }

      const images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
        width: file.width,
        height: file.height,
        format: file.format,
        size: file.size,
      }));

      res.json({
        success: true,
        images,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload images" });
    }
  }
);

// Delete image from Cloudinary
router.post("/delete", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
      
    }

    const result = await deleteImage(imageUrl);

    if (result.success) {
      res.json({ success: true, message: "Image deleted successfully" });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;
