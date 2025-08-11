import { NextFunction, Request, Response } from "express";
import accessService from "../services/access.service";
import { SuccessResponse } from "../core/success.response";
import { productService } from "../services/product.service";
import { convertToObjectIdMongodb } from "../utils";
import spuService from "../services/spu.service";
import skuService from "../services/sku.service";
import { NotFoundError } from "../core/error.response";

class ProductController {
  // S: Spu, Sku

  findOneSpu = async (req: Request, res: Response, next: NextFunction) => {
    const { product_id } = req.query;
    new SuccessResponse({
      message: "findOneSku success!!!",
      metadata: await spuService.findOneSpu({
        spu_id: product_id,
      }),
    }).send(res);
  };

  findOneSku = async (req: Request, res: Response, next: NextFunction) => {
    const { sku_id, product_id } = req.query;
    if (typeof product_id !== "string")
      throw new NotFoundError("product_id not found");
    new SuccessResponse({
      message: "findOneSku success!!!",
      metadata: await skuService.findOneSku({
        sku_id,
        product_id,
      }),
    }).send(res);
  };

  createSpu = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Create new product success!!!",
      metadata: await spuService.newSpu({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // E: Spu, Sku

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

  findAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Search product success!!!",
      metadata: await productService.findAllProduct(req.query),
    }).send(res);
  };

  findProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Search product success!!!",
      metadata: await productService.findProduct({
        id: convertToObjectIdMongodb(req.params.product_id),
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
        product_id: convertToObjectIdMongodb(req.params.product_id),
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
        product_id: convertToObjectIdMongodb(req.params.product_id),
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

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "update product success!!!",
      metadata: await productService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
}

const productController = new ProductController();
export default productController;
