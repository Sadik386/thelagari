import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
  console.log("Testing Cloudinary with credentials:");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  
  try {
    const result = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", {
      folder: "test-integration"
    });
    console.log("✅ Upload Successful!");
    console.log("URL:", result.secure_url);
    
    // Now test delete
    console.log("Testing Delete...");
    const delResult = await cloudinary.uploader.destroy(result.public_id);
    console.log("✅ Delete Result:", delResult);
  } catch (error) {
    console.error("❌ Cloudinary Test Failed!");
    console.error(error);
  }
}

testCloudinary();
