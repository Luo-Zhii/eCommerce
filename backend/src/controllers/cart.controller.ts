import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import { cartService } from "../services/cart.service";
import { ICart } from "../interface/interface";

class CartController {
  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Create cart success!!!",
      metadata: await cartService.addToCart(req.body),
    }).send(res);
  };

  updateCart = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Update cart success!!!",
      metadata: await cartService.updateToCart(req.body),
    }).send(res);
  };

  deleteCart = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Delete cart success!!!",
      metadata: await cartService.deleteCart(req.body),
    }).send(res);
  };

  getListToCart = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get cart success!!!",
      metadata: await cartService.getListUserCart({
        userId: req.query.userId,
      }),
    }).send(res);
  };

  performAction = async (req: Request, res: Response, next: NextFunction) => {
    const { cartId, state }: ICart = req.body;

    new SuccessResponse({
      message: `Cart ${state} success!`,
      metadata: await cartService.performCartAction({ cartId, state }),
    }).send(res);
  };
}
const cartController = new CartController();
export default cartController;
