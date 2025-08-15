import "dotenv/config";
import { Client } from "@elastic/elasticsearch";
import { IElacticsearch } from "../interface/interface";

let elasticClient: Client | null = null;

const instanceEventListeners = async (elasticClient: any) => {
  try {
    await elasticClient.ping();
    console.log("Success connecting to ES~~~");
  } catch (error) {
    console.error("Error connecting to elasticsearch", error);
    return null;
  }
};
const initElasticsearch = async ({
  ELASTICSEARCH_IS_ENABLED,
  ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_HOST ||
    "http://localhost:9200",
}: IElacticsearch) => {
  if (ELASTICSEARCH_IS_ENABLED) {
    elasticClient = new Client({
      node: ELASTICSEARCH_NODE,
      auth: {
        bearer: "token",
      },
    });
    await instanceEventListeners(elasticClient);
  }
  console.log("ELASTICSEARCH_NODE", ELASTICSEARCH_NODE);
};

const getElasticsearch = (): Client | null => elasticClient;

const closeElasticsearch = async () => {
  if (elasticClient) {
    try {
      await elasticClient.close();
      console.log("Elasticsearch connection closed");
    } catch (err) {
      console.error("Error closing Elasticsearch connection", err);
    }
  }
};

export { initElasticsearch, getElasticsearch, closeElasticsearch };
