import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
 console.log("REDIS_URL", REDIS_URL, "REDIS_PASSWORD", REDIS_PASSWORD)
export const client = createClient({
    url: "rediss://tf-4cx-ai-voice-redis.redis.cache.windows.net:6380",
    password: "M7UGV3hnuA1hwIdU7ma9eXqUFM6q5SEiKAzCaMIakAY=",
});

