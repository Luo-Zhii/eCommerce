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
