import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response";
import {
  IGetQueryPartition,
  IProduct,
  IShopInfo,
} from "../interface/interface";
import {
  product,
  clothing,
  electronic,
  furniture,
} from "../models/product.model";
import {
  findAllDraftForShop,
  findAllPublishedForShop,
  publishProductByShop,
  searchProduct,
  unPublishProductByShop,
} from "../models/repos/product.repo";

class ProductFactory {
  private static productRegistry: Record<string, typeof Product> = {};

  static registerProductType(type: string, classRef: typeof Product) {
    ProductFactory.productRegistry[type] = classRef;
  }

  async createProduct(type: string, payload: IProduct) {
    const productType = ProductFactory.productRegistry[type];
    console.log("productType", productType);
    if (!productType) {
      throw new BadRequestError(`Product type ${type} is not supported`);
    }
    return new productType(payload).createProduct();
  }

  // START: QUERY
  async findAllDraftForShop({ qs, limit, skip }: IGetQueryPartition) {
    const query = { ...qs, isDraft: true };
    return await findAllDraftForShop({ qs: query, limit, skip });
  }

  async findAllPublishedForShop({ qs, limit, skip }: IGetQueryPartition) {
    const query = { ...qs, isPublished: true };
    return await findAllPublishedForShop({ qs: query, limit, skip });
  }
  // END: QUERY

  // START: SEARCH
  async searchProduct({ keySearch }: { keySearch: string }) {
    return await searchProduct({ keySearch });
  }
  // END: SEARCH
  // START: PUT

  async publishProductByShop({ product_shop, _id }: IShopInfo) {
    return await publishProductByShop({
      product_shop,
      _id,
    });
  }

  async unPublishProductByShop({ product_shop, _id }: IShopInfo) {
    return await unPublishProductByShop({
      product_shop,
      _id,
    });
  }

  // END: PUT
}

// define interface class for product attributes
class Product {
  constructor(public payload: IProduct) {}

  async createProduct(product_id?: Types.ObjectId | string) {
    return await product.create({ ...this.payload, _id: product_id });
  }
}

// define sub classes for different product types
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

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.payload.product_attributes,
      product_shop: this.payload.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("Failed to create electronic product");
    }
    const newProduct = super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }
    return newProduct;
  }
}

// Register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

export const productService = new ProductFactory();
