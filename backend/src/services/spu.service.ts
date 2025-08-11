import _ from "lodash";
import { NotFoundError } from "../core/error.response";
import { ISpu } from "../interface/interface";
import { findShopById } from "../models/repos/shop.repo";
import { spu } from "../models/spu.model";
import { randonIdProduct } from "../utils";
import skuService from "./sku.service";

class SpuService {
  async newSpu({
    product_id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = [],
  }: ISpu) {
    try {
      // 1.check shop exists
      const foundShop = findShopById({
        shop_id: product_shop,
      });

      if (!foundShop) throw new NotFoundError("Shop not found");
      // 2. create new spu
      const newSpu = await spu.create({
        product_id: randonIdProduct(),
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variations,
      });

      if (newSpu && sku_list.length) {
        // 3. create skus
        await skuService.newSku({ sku_list, spu_id: newSpu.product_id }).then();
      }

      // 4. sync data via elasticsearch (search.service)

      // 5. response result obj
      return newSpu;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async findOneSpu({ spu_id }: ISpu) {
    const foundSpu = await spu
      .findOne({
        product_id: spu_id,
        isPublished: false, // true
      })
      .lean();

    if (!foundSpu) throw new NotFoundError("Spu not found");

    const foundSkus = await skuService.findBySpuId({
      product_id: foundSpu.product_id,
    });

    return {
      spu_info: _.omit(foundSpu, ["__v", "createdAt", "updatedAt"]),
      sku_list: (foundSkus ?? []).map((sku: any) =>
        _.omit(sku, ["__v", "createdAt", "updatedAt"])
      ),
    };
  }
}

const spuService = new SpuService();

export default spuService;
