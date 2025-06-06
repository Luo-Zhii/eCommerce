import { Types } from "mongoose";
import { product } from "../product.model";
import { IGetQueryPartition, IShopInfo } from "../../interface/interface";
import { BadRequestError } from "../../core/error.response";

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

export {
  findAllDraftForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProduct,
};
