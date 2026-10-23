import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// start connecting immediately so commands issued at import time (e.g. the rate limit
// store loading its scripts) are queued until the connection is ready instead of failing
const connection = redisClient.connect();

async function connectRedis() {
  await connection;
}

export { redisClient, connectRedis };
