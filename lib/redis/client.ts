import { Redis } from "ioredis"

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

if (!redisUrl || !redisToken) {
  throw new Error("Redis URL or token not defined in environment variables")
}

const getRedisUrl = () => {
  if (redisUrl.startsWith("https://")) {
    // Extract host and port from the URL
    const url = new URL(redisUrl)
    const host = url.hostname
    const port = Number.parseInt(url.port || "6379", 10)
    const password = redisToken
    return { host, port, password }
  }
  return redisUrl
}

const redisConfig = getRedisUrl()
const redis =
  typeof redisConfig === "string"
    ? new Redis(redisConfig)
    : new Redis(redisConfig.port, redisConfig.host, { password: redisConfig.password })

export default redis
