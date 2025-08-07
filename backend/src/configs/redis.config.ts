import { createClient, RedisClientType } from "redis";
import { RedisErrorResponse } from "../core/error.response";
import { RedisConnect } from "../constants/const";

let redisClient: RedisClientType;

const statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error",
};

let connectionTimeout: NodeJS.Timeout;

const handleRedisError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse(RedisConnect.CONNECT_REDIS_MESSAGE);
  }, RedisConnect.CONNECT_REDIS_TIMEOUT);
};

const handleEventConnection = (client: RedisClientType) => {
  client.on(statusConnectRedis.CONNECT, () => {
    console.log("Redis - Connection status: connected");
    clearTimeout(connectionTimeout);
  });

  client.on(statusConnectRedis.END, () => {
    console.log("Redis - Connection status: disconnected");
    handleRedisError();
  });

  client.on(statusConnectRedis.RECONNECT, () => {
    console.log("Redis - Reconnecting...");
    handleRedisError();
  });

  client.on(statusConnectRedis.ERROR, (err) => {
    console.log("Redis - Error:", err);
    handleRedisError();
  });
};

const initRedis = async () => {
  redisClient = createClient();
  handleEventConnection(redisClient);

  try {
    await redisClient.connect();
    const result = await redisClient.ping();
    console.log(`Connected to Redis: ${result}`);
  } catch (err) {
    console.error("Redis connect failed:", err);
  }
};

const getRedis = (): RedisClientType => redisClient;

const closeRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log("Redis - Closed connection");
    } catch (err) {
      console.error("Redis - Error closing connection", err);
    }
  }
};

export { initRedis, getRedis, closeRedis };
