import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../utils/redis.js';

// rate limiting middleware for all api routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // limit each IP to 100 requests per windowMs

  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rate-limit:",
  }),

  standardHeaders: "draft-8",
  legacyHeaders: false,
  passOnStoreError: true, // allow requests through if redis is unavailable

  message: {
    success: false,
    message: "Too many requests. Try again later.",
  },
});

// rate limiting middleware for login route
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // limit each IP to 5 requests per windowMs

  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "login-limit:",
  }),

  standardHeaders: "draft-8",
  legacyHeaders: false,
  passOnStoreError: true,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

export { loginRateLimit, apiLimiter };
