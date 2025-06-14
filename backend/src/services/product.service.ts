import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response";
import {
  IGetAllQueryPartitionSelectData,
  IGetQueryPartition,
  IGetAllQueryPartitionUnSelectData,
  IProduct,
  IShopInfo,
  IUpdateProduct,
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
  findAllProduct,
  findProduct,
  updateProductById,
} from "../models/repos/product.repo";
import { removeDataNull, updateNestedData } from "../utils";
import insertInventory from "../models/repos/inventory.repo";
import { union } from "lodash";

class ProductFactory {
  private static productRegistry: Record<string, typeof Product> = {};

  static registerProductType(type: string, classRef: typeof Product) {
    ProductFactory.productRegistry[type] = classRef;
  }

  async createProduct(type: string, payload: IProduct) {
    const productType = ProductFactory.productRegistry[type];
    if (!productType) {
      throw new BadRequestError(`Product type ${type} is not supported`);
    }
    return new productType(payload).createProduct();
  }

  // START: Query
  async findAllDraftForShop({ qs, limit, skip }: IGetQueryPartition) {
    const query = { ...qs, isDraft: true };
    return await findAllDraftForShop({ qs: query, limit, skip });
  }

  async findAllPublishedForShop({ qs, limit, skip }: IGetQueryPartition) {
    const query = { ...qs, isPublished: true };
    return await findAllPublishedForShop({ qs: query, limit, skip });
  }

  // END: Query

  // START: Search
  async searchProduct({ keySearch }: { keySearch: string }) {
    return await searchProduct({ keySearch });
  }

  async findAllProduct({
    limit,
    sort,
    page,
    filter,
  }: IGetAllQueryPartitionSelectData) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter: { ...filter, isDraft: false, isPublished: true },
      select: ["product_name", "product_thumb", "product_price"],
    });
  }

  async findProduct({ product_id }: IGetAllQueryPartitionUnSelectData) {
    return await findProduct({ product_id, unSelect: ["__v", "product_slug"] });
  }

  // END: Search
  // START: Put

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

  // END: Put

  // START: Update

  async updateProduct(type: string, productId: any, payload: any) {
    const productType = ProductFactory.productRegistry[type];
    if (!productType) {
      throw new BadRequestError(`Product type ${type} is not supported`);
    }

    return new productType(payload).updateProduct({ productId });
  }

  // END: Update
}

// define interface class for product attributes
class Product {
  constructor(public payload: IProduct) {}

  async createProduct(product_id?: Types.ObjectId | string) {
    const newProduct = await product.create({
      ...this.payload,
      _id: product_id,
    });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.payload.product_shop,
        stock: this.payload.product_quantity,
      });
    }
    return newProduct;
  }

  async updateProduct({ productId, payload }: IUpdateProduct) {
    return await updateProductById({ productId, payload, model: product });
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

  async updateProduct({ productId }: IUpdateProduct) {
    // 1. remove attr null or undefined
    const updatePayload = await removeDataNull(this.payload);

    // 2. check where update?
    if (updatePayload.product_attributes) {
      // update child attributes if needed
      await updateProductById({
        productId,
        payload: updatePayload,
        model: clothing,
      });
    }

    // update main product document
    return await super.updateProduct({
      productId,
      payload: updateNestedData(updatePayload),
    });
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
