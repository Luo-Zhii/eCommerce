import { Types } from "mongoose";
import { product } from "../product.model";
import {
  IGetQueryPartition,
  IShopInfo,
  IGetAllQueryPartitionSelectData,
  IGetAllQueryPartitionUnSelectData,
} from "../../interface/interface";
import { BadRequestError } from "../../core/error.response";
import { getSelectData, unGetSelectData } from "../../utils";
import { IUpdateProduct } from "../../interface/interface";

// START: Find
const findAllDraftForShop = async ({ qs, limit, skip }: IGetQueryPartition) => {
  return queryPartition({ qs, limit, skip });
};

const findAllPublishedForShop = async ({
  qs,
  limit,
  skip,
}: IGetQueryPartition) => {
  return queryPartition({ qs, limit, skip });
};

const queryPartition = async ({
  qs,
  limit = 10,
  skip = 0,
}: IGetQueryPartition) => {
  const query = await product
    .find(qs)
    .populate("product_shop", { name: 1, email: 1, _id: 0 })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  return query;
};

const findAllProduct = async ({
  limit = 50,
  sort,
  page,
  filter,
  select,
}: IGetAllQueryPartitionSelectData) => {
  const skip = page ? (page - 1) * limit : 0;

  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };

  const result = await product
    .find(filter || {})
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return result;
};

const findProduct = async ({
  product_id,
  unSelect = [],
}: IGetAllQueryPartitionUnSelectData) => {
  const foundProduct = await product
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
  return foundProduct;
};

// END: Find
// START: Search

const searchProduct = async ({ keySearch }: { keySearch: string }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};

// END: Search

// START: Update

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}: IUpdateProduct) => {
  const result = await model.findByIdAndUpdate(productId, payload, {
    new: isNew,
  });
  return result;
};
// END: Update

// START: Publish/Unpublish
const publishProductByShop = async ({ product_shop, _id }: IShopInfo) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: _id,
  });
  if (!foundShop) {
    throw new BadRequestError("Product not found for the given shop");
  }
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await product.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, _id }: IShopInfo) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: _id,
  });
  if (!foundShop) {
    throw new BadRequestError("Product not found for the given shop");
  }
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await product.updateOne(foundShop);
  return modifiedCount;
};

// END: Publish/Unpublish

export {
  findAllDraftForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProduct,
  findAllProduct,
  findProduct,
  updateProductById,
};
