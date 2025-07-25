import apiKeyModel from "../models/apiKey.model";
import * as crypto from "crypto";

const createApiKey = async () => {
  const key = crypto.randomBytes(64).toString("hex");
  return await apiKeyModel.create({ key, permissions: ["0000"] });
};

const findById = async (key: string) => {
  return await apiKeyModel.findOne({ key, status: true }).lean();
};
export { findById, createApiKey };
