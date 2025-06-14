import { IInventory } from "../../interface/interface";
import inventory from "../inventory.model";

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}: IInventory) => {
  return await inventory.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};
export default insertInventory;
