import { IShop } from "../../interface/interface";
import shop from "../shop.model";

const selectStruct = {
  email: 1,
  name: 1,
  status: 1,
  role: 1,
};

const findShopById = async ({ shop_id, select = selectStruct }: IShop) => {
  return await shop.findById(shop_id).select(select);
};
export { findShopById };
