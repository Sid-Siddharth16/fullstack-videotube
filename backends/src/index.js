import dotenv from "dotenv";
import connectToDatabase from "./db/index.js";
import { connectRedis } from "./utils/redis.js";
import app from "./app.js";

// load environment variables from .env file
dotenv.config({
    path: "./.env"
})

// connect to database and redis, then start the server
Promise.all([connectToDatabase(), connectRedis()])
    .then(
        () => {
            console.log("Connected to MongoDB and Redis");
            app.listen(process.env.PORT || 8000, () => {
                console.log(`APP is running on port ${process.env.PORT}`);
            })
        }
    )
    .catch((err) => {
        console.error("Error connecting to MongoDB/Redis:", err);
    }
    )