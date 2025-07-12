import { Types } from "mongoose";

// Access
export interface IRefreshToken {
  keyStore: any;
  user: string;
  refreshToken: string;
}

export interface IAccessToken {
  keyStore: any;
  user: string;
  accessToken: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
}

export interface IKeyStore {
  user: string | Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken: string;
  refreshTokensUsed: string[];
}

// Shop

export interface IShop {
  name: string;
  email: string;
  password: string;
}

export interface IShopInfo {
  product_shop: Object | Types.ObjectId;
  product_id?: Types.ObjectId;
}

// Product
export interface IProduct {
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_shop: string;
  product_attributes: any;
}

// Query
export interface IFindByEmailParams {
  email: string;
  select?: string | string[] | Record<string, any>;
}

export interface IGetQueryPartition {
  qs: Record<string, Object> | any;
  limit?: number | undefined;
  skip?: number | undefined;
}

export interface IGetAllQueryPartitionSelectData {
  limit?: number | undefined;
  sort?: string | undefined;
  page?: number | undefined;
  filter?: Array | undefined;
  select?: Array | undefined;
  skip?: number | undefined;
  id?: any;
}

export interface IGetAllQueryPartitionUnSelectData {
  id?: any;
  unSelect?: Array | undefined;
  limit?: number | undefined;
  sort?: string | undefined;
  page?: number | undefined;
  filter?: Array | undefined;
  skip?: number | undefined;
}

export interface IUpdateProduct {
  productId: any;
  payload?: any;
  model?: any;
  isNew?: boolean;
}

// Inventory
export interface IInventory {
  productId?: string | Types.ObjectId;
  shopId?: string | Types.ObjectId;
  location?: string;
  stock?: Number;
  reservation?: Array;
}

// Cart
export interface ICart {
  userId?: any;
  product?: any;
  quantity?: Number;
  state?: string;
  cartId?: Types.ObjectId;
  productId?: Types.ObjectId;
  shop_order_ids?: Array;
}

// Discount
export interface IDiscount {
  discount_name: string;
  discount_description: string;
  discount_type: "fixed_amount" | "percentage";
  discount_value: number;
  discount_code: string;
  discount_start_date: Date;
  discount_end_date: Date;
  discount_max_uses: number;
  discount_uses_count: number;
  discount_users_used: string[];
  discount_max_uses_per_user: number;
  discount_min_order_value: number;
  discount_shopId: Types.ObjectId | string;
  discount_is_active: boolean;
  discount_applies_to: "all" | "specific";
  discount_product_ids: string[];
}

export interface IUpdateDiscount {
  discountId?: any;
  payload?: any;
  isNew?: boolean;
}

export interface IFindDiscountForProduct {
  code?: string;
  codeId?: string;
  shopId?: any;
  userId?: any;
  limit?: number;
  page?: number;
  products?: any;
}

// checkout
export interface ICheckout {
  cartId?: any;
  userId?: Number;
  shop_order_ids?: Array;
}

// Order
export interface IOrder {
  shop_order_ids?: Array;
  cartId?: any;
  userId?: Number;
  user_address?: Object;
  user_payment?: Object;
}

export interface IGetAllQueryPartitionOrder {
  limit?: number | undefined;
  sort?: string | undefined;
  page?: number | undefined;
  filter?: Array | undefined;
  select?: Array | undefined;
  skip?: number | undefined;
  userId: Number;
}

// Lock redis
export interface ILock {
  cartId?: any;
  quantity?: Number | undefined;
  productId?: any;
}

// redis
export interface IRedisPubSub {
  channel?: string | number;
  message?: string;
  callback?: any;
}

// comments
export interface IComment {
  commentId?: Types.ObjectId;
  productId?: Types.ObjectId;
  userId?: Number;
  content?: String;
  parentCommentId?: any;
  limit?: Number;
  offset?: Number;
}

// notification
export interface INotification {
  type?: String;
  received?: Number;
  sender?: Types.ObjectId | undefined;
  options?: any;
  userId?: Number;
  isRead?: boolean;
}
