/**
 * Discount service
 * 1 - gene discount code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Admin | Shop]
 * 6 - Cancel discount code [User]
 */

import { BadRequestError, NotFoundError } from "../core/error.response";
import { defaultDiscount } from "../constants/const";
import {
  IDiscount,
  IFindDiscountForProduct,
  IGetAllQueryPartitionUnSelectData,
  IUpdateDiscount,
} from "../interface/interface";
import discount from "../models/discount.model";
import {
  convertToObjectIdMongodb,
  removeDataNull,
  updateNestedData,
} from "../utils";
import {
  checkDiscountExists,
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnSelect,
  normalizeDiscount,
  updateDiscountById,
} from "../models/repos/discount.repo";
import buildDiscountFromPayload from "../helpers/discount/discount.builder";
import toDiscountProps from "../helpers/discount/discount.doc";
import { findAllProduct } from "../models/repos/product.repo";
import { Types } from "mongoose";

class DiscountProduct implements IDiscount {
  discount_name!: string;
  discount_description!: string;
  discount_type!: "fixed_amount" | "percentage";
  discount_value!: number;
  discount_code!: string;
  discount_start_date!: Date;
  discount_end_date!: Date;
  discount_max_uses!: number;
  discount_uses_count!: number;
  discount_users_used!: string[];
  discount_max_uses_per_user!: number;
  discount_min_order_value!: number;
  discount_shopId!: string;
  discount_is_active!: boolean;
  discount_applies_to!: "all" | "specific";
  discount_product_ids!: string[];

  constructor(builder: IDiscount) {
    Object.assign(this, builder);
  }
}
class DiscountBuilder {
  private data: IDiscount = structuredClone(defaultDiscount);

  with<K extends keyof IDiscount>(key: K, value: IDiscount[K] | undefined) {
    this.data[key] = value as IDiscount[K];
    return this;
  }

  build(): DiscountProduct {
    // Check error
    const now = Date.now();
    const start = new Date(this.data.discount_start_date).getTime();
    const end = new Date(this.data.discount_end_date).getTime();

    if (now < start) {
      throw new BadRequestError("Discount has not started yet");
    }

    if (now > end) {
      throw new BadRequestError("Discount code has expired");
    }

    if (start >= end) {
      throw new BadRequestError("Start date must be before end date");
    }

    if (!this.data.discount_is_active) {
      throw new NotFoundError("discount expried");
    }

    if (!this.data.discount_max_uses) {
      throw new NotFoundError("discount are out");
    }

    // build and reset
    const product = new DiscountProduct(this.data);
    this.data = structuredClone(defaultDiscount); // reset
    return product;
  }
}

class DiscountService {
  async createDiscount(payload: Partial<IDiscount>) {
    const discountBuilt = buildDiscountFromPayload(payload);

    const foundDiscount = await discount
      .findOne({
        discount_code: discountBuilt.discount_code,
        discount_shopId: convertToObjectIdMongodb(
          discountBuilt.discount_shopId
        ),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists");
    }

    return await discount.create(toDiscountProps(discountBuilt));
  }

  async updateDiscount(discountId: any, payload: Partial<IUpdateDiscount>) {
    const cleanPayload = removeDataNull(payload);

    const current = await discount.findById(discountId).lean();
    if (!current) throw new NotFoundError("Discount not found");

    const mergedData: any = { ...current, ...cleanPayload };
    const discountBuilt = buildDiscountFromPayload(mergedData);

    return await updateDiscountById({
      discountId: convertToObjectIdMongodb(discountId),
      payload: updateNestedData(toDiscountProps(discountBuilt)),
    });
  }

  // Get all discount codes available with products
  async getAllDiscountedProductsByCode({
    code,
    shopId,
    limit = 50,
    page = 1,
  }: IFindDiscountForProduct) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists");
    }

    let products;

    if (foundDiscount.discount_applies_to === "all") {
      products = await findAllProduct({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else if (foundDiscount.discount_applies_to === "specific") {
      products = await findAllProduct({
        filter: {
          _id: { $in: foundDiscount.discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
      console.log("products", products);
    } else {
      throw new BadRequestError("Invalid discount_applies_to value");
    }

    return products;
  }

  // get all discount code of shop
  async getAllDiscountCodesByShop({
    limit = 50,
    page = 1,
    id: shopId,
  }: IGetAllQueryPartitionUnSelectData) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      select: ["discount_name", "discount_code"],
    });

    return discounts;
  }

  async getDiscountAmount({
    codeId,
    userId,
    shopId,
    products,
  }: IFindDiscountForProduct) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exists");
    }

    const discountBuilt = buildDiscountFromPayload(
      normalizeDiscount(foundDiscount)
    );

    // check min
    let totalOrder = 0;
    if (discountBuilt.discount_min_order_value > 0) {
      totalOrder = products.reduce((acc: number, product: any) => {
        return acc + product.quantity * product.price;
      }, 0);
    }
    if (discountBuilt.discount_max_uses_per_user > 0) {
      const hasUsed = discountBuilt.discount_users_used.includes(userId);
      if (hasUsed) {
        throw new BadRequestError("User has already used this discount code");
      }
    }

    const amount =
      discountBuilt.discount_type === "fixed_amount"
        ? discountBuilt.discount_value
        : totalOrder * (discountBuilt.discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  // 5 - Delete discount code [Admin | Shop]
  async deleteDiscount({
    shopId,
    code,
  }: {
    shopId: string | Types.ObjectId;
    code: string;
  }) {
    const deleted = await discount.findByIdAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });
    return deleted;
  }
  // 6 - Cancel discount code [User]
  async cancelDiscount({
    code,
    shopId,
    userId,
  }: {
    shopId: Types.ObjectId;
    code: string;
    userId: Types.ObjectId;
  }) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exists");
    }

    const result = await discount.findByIdAndUpdate(
      normalizeDiscount(foundDiscount)._id,
      {
        $pull: {
          discount_users_used: userId,
        },
        $inc: {
          discount_max_uses: 1,
          discount_uses_count: -1,
        },
      }
    );
    return result;
  }
}
const discountService = new DiscountService();
export { DiscountProduct, DiscountBuilder, discountService };
