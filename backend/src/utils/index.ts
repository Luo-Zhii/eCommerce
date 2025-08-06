import pick from "lodash/pick";
import { Types } from "mongoose";
import { ITemplate } from "../interface/interface";

const convertToObjectIdMongodb = (id: string | Types.ObjectId) =>
  new Types.ObjectId(id);

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

// START: Remove null

const removeDataNull = async (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key];
    }
  });

  return obj;
};

/**
 * const a = {
 *  b: 1
 *  c: {
 *    d: 2;
 *    e: 3
 *  }
 * }
 *
 * db.collect.updateOne({
 *  c.d : 2
 * })
 */
const updateNestedData = (obj: Record<string, any>): Record<string, any> => {
  const final: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const res = updateNestedData(obj[key]);
      Object.keys(res).forEach((keyNested) => {
        final[`${key}.${keyNested}`] = res[keyNested];
      });
    } else {
      final[key] = obj[key];
    }
  });

  return final;
};

// END: Remove null

//

const replacePlaceHolder = ({ template, params }: ITemplate) => {
  Object.keys(params).forEach((k) => {
    const placeholder = `{{${k}}}`; // {{link_verify}}
    template = template?.replace(new RegExp(placeholder, "g"), params[k]);
  });

  return template;
};

export {
  convertToObjectIdMongodb,
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeDataNull,
  updateNestedData,
  replacePlaceHolder,
};
