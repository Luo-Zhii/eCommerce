import { SuccessResponse } from "../core/success.response";
import { discountService } from "../services/discount.service";
import { IDiscount } from "../interface/interface";
import { NextFunction, Request, Response } from "express";

class DiscountController {
  createDiscountCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Success Code Generation!!!",
      metadata: await discountService.createDiscount({
        ...(req.body as Partial<IDiscount>),
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Success Code Found!!!",
      metadata: await discountService.getAllDiscountCodesByShop({
        ...req.query,
        id: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Success Code Found Amount!!!",
      metadata: await discountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountedProductsByCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Success Code Found!!!",
      metadata: await discountService.getAllDiscountedProductsByCode({
        ...req.query,
      }),
    }).send(res);
  };

  updateDiscount = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Success Code Found!!!",
      metadata: await discountService.updateDiscount(req.params.productId, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscount = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Success Code Found!!!",
      metadata: await discountService.deleteDiscount({
        code: req.params.code,
        shopId: req.params.shopId,
      }),
    }).send(res);
  };

  cancelDiscount = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Cancel discount success!!!",
      metadata: await discountService.cancelDiscount({
        code: req.body,
        shopId: req.user.userId,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

const discountController = new DiscountController();
export default discountController;
