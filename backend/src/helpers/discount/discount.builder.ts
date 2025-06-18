import { IDiscount } from "../../interface/interface";
import {
  DiscountBuilder,
  DiscountProduct,
} from "../../services/discount.service";

const buildDiscountFromPayload = (
  payload: Partial<IDiscount>
): DiscountProduct => {
  const builder = new DiscountBuilder();

  for (const key in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      builder.with(key as keyof IDiscount, payload[key as keyof IDiscount]);
    }
  }

  return builder.build();
};

export default buildDiscountFromPayload;
