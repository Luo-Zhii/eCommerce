import { NextFunction, Request, Response } from "express";
import accessService from "../services/access.service";
import { SuccessResponse } from "../core/success.response";
import { productService } from "../services/product.service";

class ProductController {
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Create new product success!!!",
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  findAllDraftForShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get all draft products for shop success!!!",
      metadata: await productService.findAllDraftForShop({
        qs: { product_shop: req.user.userId },
        limit: req.query.limit ? +req.query.limit : 10,
        skip: req.query.skip ? +req.query.skip : 0,
      }),
    }).send(res);
  };

  findAllPublishedForShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get all published products for shop success!!!",
      metadata: await productService.findAllPublishedForShop({
        qs: { product_shop: req.user.userId },
        limit: req.query.limit ? +req.query.limit : 10,
        skip: req.query.skip ? +req.query.skip : 0,
      }),
    }).send(res);
  };

  publishedProductForShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get all published products for shop success!!!",
      metadata: await productService.publishProductByShop({
        product_shop: req.user.userId,
        _id: req.params.id,
      }),
    }).send(res);
  };

  unPublishedProductForShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get all published products for shop success!!!",
      metadata: await productService.unPublishProductByShop({
        product_shop: req.user.userId,
        _id: req.params.id,
      }),
    }).send(res);
  };

  searchProduct = async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.searchProduct(
      req.params as { keySearch: string }
    );
    new SuccessResponse({
      message: "Search product success!!!",
      metadata: result,
    }).send(res);
  };
}

const productController = new ProductController();
export default productController;
