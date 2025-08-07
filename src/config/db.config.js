// Database logic...
import {TryCatchHandler} from "../middlewares/tryCatchHandler.js";
import mongoose from "mongoose";

const ConnectDB = TryCatchHandler(async () => {
  const dbURL = process.env.DB_URL;

  const connection = await mongoose.connect(dbURL);

  if (connection) {
    console.log("Database Connected Successfully ✅");
  } else {
    console.error("Database Connection Failed ❌");
  }
});

export default ConnectDB;