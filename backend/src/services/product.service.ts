import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response";
import { IProduct } from "../interface/interface";
import { product, clothing, electronic } from "../models/product.model";

class ProductFactory {
  async createProduct(type: string, payload: IProduct) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronic":
        return new Electronic(payload).createProduct();
      default:
        return new BadRequestError(`Product type ${type} is not supported`);
    }
  }
}

class Product {
  constructor(public payload: IProduct) {}

  async createProduct(product_id: Types.ObjectId | string) {
    return await product.create({ ...this.payload, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.payload.product_attributes,
      product_shop: this.payload.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Failed to create clothing product");
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.payload.product_attributes,
      product_shop: this.payload.product_shop,
    });
    console.log("newElectronic", newElectronic);
    if (!newElectronic) {
      throw new BadRequestError("Failed to create electronic product");
    }
    const newProduct = super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }
    return newProduct;
  }
}

export const productService = new ProductFactory();
