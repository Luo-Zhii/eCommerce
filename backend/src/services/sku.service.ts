import { nextTick } from "process";
import { ISku } from "../interface/interface";
import { sku } from "../models/sku.model";
import { randonIdProduct } from "../utils";
import _ from "lodash";
class SkuService {
  async newSku({ spu_id, sku_list }: ISku) {
    try {
      const converSkuList = sku_list.map((sku: any) => {
        return {
          ...sku,
          product_id: spu_id,
          sku_id: `${spu_id}.${randonIdProduct()}`,
        };
      });
      const skus = await sku.create(converSkuList);
      return skus;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async findOneSku({ sku_id, product_id }: ISku) {
    try {
      const foundSku = await sku
        .findOne({
          sku_id,
          product_id,
        })
        .lean();
      if (sku) {
        // set cached
      }
      return _.omit(foundSku, ["__v", "createdAt", "updatedAt"]);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async findBySpuId({ product_id }: ISku) {
    const foundSkus = await sku
      .find({ product_id })
      .select("-__v -createdAt -updatedAt")
      .lean();
    return foundSkus;
  }
}

const skuService = new SkuService();
export default skuService;
