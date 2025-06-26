import { createClient } from "redis";
import { BadRequestError } from "../core/error.response";
import { ILock } from "../interface/interface";

let redisClient: ReturnType<typeof createClient>;

const initRedis = async () => {
  redisClient = createClient();

  redisClient.on("error", (err) => console.error("Redis Error", err));

  await redisClient.connect();
};

const acquireLock = async ({ productId, cartId, quantity }: ILock) => {
  const key = `lock_v2025_${productId}`;
  const expireMS = 3000;
  const retryTime = 10;
  const uniqueValue = `${cartId}-${Date.now()}`;

  for (let i = 0; i < retryTime; i++) {
    const result = await redisClient.set(key, uniqueValue, {
      NX: true,
      PX: expireMS,
    });

    if (result === "OK") {
      console.log("pessimistic lock OK!!!");
      return { key, value: uniqueValue };
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new BadRequestError("Failed to acquire lock after retryTime");
};

const releaseLock = async ({ key, value }: { key: string; value: string }) => {
  const currentValue = await redisClient.get(key);
  if (currentValue === value) {
    await redisClient.del(key);
  }
};

export { initRedis, acquireLock, releaseLock };
