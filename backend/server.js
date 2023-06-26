const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

dotenv.config({ path: "backend/config/config.env" });

//connecting the databse
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

let server = app.listen(process.env.PORT, () => {
  console.log(`server listen on http://localhost:${process.env.PORT}`);
});

// Handling Uncaught Error

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Error: ${err.message}`);
  process.exit(1);
});

// Handling Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Error ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
