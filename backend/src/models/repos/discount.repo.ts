import { BadRequestError } from "../../core/error.response";
import {
  IDiscount,
  IGetAllQueryPartitionSelectData,
  IGetAllQueryPartitionUnSelectData,
  IUpdateDiscount,
} from "../../interface/interface";
import { getSelectData, unGetSelectData } from "../../utils";
import discount from "../discount.model";

const updateDiscountById = async ({
  discountId,
  payload,
  isNew = true,
}: IUpdateDiscount) => {
  const result = await discount.findByIdAndUpdate(discountId, payload, {
    new: isNew,
  });
  return result;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  sort,
  page,
  filter,
  select,
}: IGetAllQueryPartitionSelectData) => {
  const skip = page ? (page - 1) * limit : 0;

  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };

  const result = await discount
    .find(filter || {})
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return result;
};

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  sort,
  page,
  filter,
  unSelect,
}: IGetAllQueryPartitionUnSelectData) => {
  const skip = page ? (page - 1) * limit : 0;

  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };

  const result = await discount
    .find(filter || {})
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
  return result;
};

const checkDiscountExists = async ({
  filter,
}: {
  filter: Record<string, any>;
}) => {
  return await discount.find(filter).lean();
};

const normalizeDiscount = (input: any) => {
  const discountDoc = Array.isArray(input) ? input[0] : input;

  if (!discountDoc) {
    throw new BadRequestError("Discount data is missing");
  }

  const plainDiscount =
    typeof discountDoc.toObject === "function"
      ? discountDoc.toObject()
      : discountDoc;

  return {
    ...plainDiscount,
  };
};

export {
  updateDiscountById,
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
  normalizeDiscount,
};
