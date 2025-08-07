import { IDiscount, IRedisConnection } from "../interface/interface";

export const defaultDiscount: IDiscount = {
  discount_name: "",
  discount_description: "",
  discount_type: "fixed_amount",
  discount_value: 0,
  discount_code: "",
  discount_start_date: new Date(),
  discount_end_date: new Date(),
  discount_max_uses: 1,
  discount_uses_count: 0,
  discount_users_used: [],
  discount_max_uses_per_user: 1,
  discount_min_order_value: 0,
  discount_shopId: "",
  discount_is_active: true,
  discount_applies_to: "all",
  discount_product_ids: [],
};

export const RedisConnect: IRedisConnection = {
  CONNECT_REDIS_TIMEOUT: 0,
  CONNECT_REDIS_MESSAGE: "Server Redis Error",
};
