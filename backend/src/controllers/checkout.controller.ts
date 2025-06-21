import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import checkoutService from "../services/checkout.service";

class CheckoutController {
  checkoutReview = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "checkoutReview success!!!",
      metadata: await checkoutService.checkoutReview(req.body),
    }).send(res);
  };
}
const checkoutController = new CheckoutController();
export default checkoutController;
