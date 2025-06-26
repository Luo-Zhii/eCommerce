import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import inventoryService from "../services/inventory.service";

class InventoryController {
  addStockToInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "addStockToInventory success!!!",
      metadata: await inventoryService.addStockToInventory({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}

const inventoryController = new InventoryController();
export default inventoryController;
