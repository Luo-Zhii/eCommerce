export interface IShop {
  name: string;
  email: string;
  password: string;
}

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
interface IKeyStore {
  user: string | Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken: string;
  refreshTokensUsed: string[];
}
export interface IRefreshToken {
  keyStore: any;
  user: string;
  refreshToken: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
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
}

export interface IGetAllQueryPartitionUnSelectData {
  product_id: Types.ObjectId;
  unSelect?: Array | undefined;
}

export interface IShopInfo {
  product_shop: Object | Types.ObjectId;
  _id: Types.ObjectId;
}
