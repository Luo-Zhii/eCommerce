import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import checkoutService from "../services/checkout.service";

class CheckoutController {
  // [POST] /v1/checkout/review
  checkoutReview = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "checkoutReview success!!!",
      metadata: await checkoutService.checkoutReview(req.body),
    }).send(res);
  };

  // [POST] /v1/checkout/order
  orderByUser = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "order created successfully!!!",
      metadata: await checkoutService.orderByUser({
        ...req.body,
      }),
    }).send(res);
  };

  // [GET] /v1/checkout/orders
  getOrderByUser = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "get all user orders success!!!",
      metadata: await checkoutService.getOrderByUser({
        ...req.query,
        id: req.body.userId,
      }),
    }).send(res);
  };

  // [GET] /v1/checkout/order/:orderId
  getOneOrderByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "get order by id success!!!",
      metadata: await checkoutService.getOneOrderByUser({
        orderId: req.params.orderId,
        userId: req.body.userId,
      }),
    }).send(res);
  };

  // [PATCH] /v1/checkout/order/:orderId/cancel
  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "cancel order success!!!",
      metadata: await checkoutService.cancelOrder({
        orderId: req.params.orderId,
        userId: req.body.userId,
      }),
    }).send(res);
  };

  // [PATCH] /v1/checkout/shop/order/:orderId/status
  updateOrderStatusByShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "update order status success!!!",
      metadata: await checkoutService.updateOrderStatusByShop({
        orderId: req.params.orderId,
        shopId: req.user.shopId,
        newStatus: req.body.newStatus,
      }),
    }).send(res);
  };
}

const checkoutController = new CheckoutController();
export default checkoutController;
