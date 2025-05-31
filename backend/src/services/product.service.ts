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

  async createProduct() {
    return await product.create(this.payload);
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.payload.product_attributes);
    if (!newClothing) {
      throw new BadRequestError("Failed to create clothing product");
    }

    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(
      this.payload.product_attributes
    );
    if (!newElectronic) {
      throw new BadRequestError("Failed to create electronic product");
    }
    const newProduct = super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }
    return newProduct;
  }
}

export const productService = new ProductFactory();
