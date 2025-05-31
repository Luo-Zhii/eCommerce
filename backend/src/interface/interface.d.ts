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
