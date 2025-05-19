import shopModel from "../models/shop.model";

const findByEmail = async (
  email: string,
  select: string | string[] | Record<string, any> = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  }
) => {
  const shop = await shopModel.findOne({ email }).select(select).lean();
  return shop;
};

export { findByEmail };
