import { IFindByEmailParams } from "../interface/interface";
import shopModel from "../models/shop.model";

const findByEmail = async ({ email, select }: IFindByEmailParams) => {
  const defaultSelect = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  };
  const shop = await shopModel
    .findOne({ email })
    .select(select ?? defaultSelect)
    .lean();
  return shop;
};

export { findByEmail };
