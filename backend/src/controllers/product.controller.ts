import { NextFunction, Request, Response } from "express";
import accessService from "../services/access.service";
import { SuccessResponse } from "../core/success.response";
import { productService } from "../services/product.service";

class ProductController {
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Create new product success!!!",
      metadata: await productService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
}

const productController = new ProductController();
export default productController;
