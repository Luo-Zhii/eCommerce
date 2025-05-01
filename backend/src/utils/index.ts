import pick from "lodash/pick";

const getInfoData = ({
  fields,
  object,
}: {
  fields: string[];
  object: Record<string, any>;
}) => {
  return pick(object, fields);
};

export { getInfoData };
