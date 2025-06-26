import { BadRequestError, NotFoundError } from "../core/error.response";
import { IInventory } from "../interface/interface";
import inventory from "../models/inventory.model";
import { getProductById } from "../models/repos/product.repo";

class InventoryService {
  async addStockToInventory({
    productId,
    shopId,
    stock,
    location = "unknown",
  }: IInventory) {
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError("Product not found");
    }

    if (!shopId || product.product_shop.toString() !== shopId.toString()) {
      throw new NotFoundError(
        "You do not have permission to update this product's inventory"
      );
    }

    const query = { inven_productId: productId, inven_shopId: shopId },
      update = {
        $inc: { inven_stock: stock },
        $set: { inven_location: location },
      },
      options = { upsert: true, new: true };
    return await inventory.findOneAndUpdate(query, update, options);
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
