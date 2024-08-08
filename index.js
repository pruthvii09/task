import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./database/connectToDb.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Listening on Port ${PORT} 🚀🚀...`);
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });

export { app };
