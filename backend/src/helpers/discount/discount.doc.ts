import { DiscountProduct } from "../../services/discount.service";
import { convertToObjectIdMongodb } from "../../utils";

const toDiscountProps = (discount: DiscountProduct) => {
  return {
    ...discount,
    discount_product_ids:
      discount.discount_applies_to === "all"
        ? []
        : discount.discount_product_ids,
    discount_shopId: convertToObjectIdMongodb(discount.discount_shopId),
    discount_start_date: new Date(discount.discount_start_date),
    discount_end_date: new Date(discount.discount_end_date),
  };
};
export default toDiscountProps;
