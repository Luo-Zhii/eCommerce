import { IGetAllQueryPartitionSelectData } from "../../interface/interface";
import { getSelectData } from "../../utils";
import order from "../order.model";

const getOrderByUser = async ({
  limit = 50,
  sort,
  page,
  filter,
  select,
}: IGetAllQueryPartitionSelectData) => {
  const skip = page ? (page - 1) * limit : 0;

  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };

  const result = await order
    .find(filter || {})
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return result;
};

export { getOrderByUser };
