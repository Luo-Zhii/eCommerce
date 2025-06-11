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

// START: Select Data

// ["a","b"] => { a: 1, b: 1 }
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 1]));
};

// ["a","b"] => { a: 0, b: 0 }
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 0]));
};
// END: Select Data

export { getInfoData, getSelectData, unGetSelectData };
