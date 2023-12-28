import DBconnection from "./Config/DBconnection.js";
import app from "./app.js";
import cloudinary from "cloudinary"

const PORT = process.env.PORT || 5000;

//cloundinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



app.listen(PORT, async () => {
  await DBconnection();
  console.log(`server is running at http://localhost:${PORT}`);
});
