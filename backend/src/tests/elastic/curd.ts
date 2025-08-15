import { IElacticsearch } from "../../interface/interface";
import {
  getElasticsearch,
  initElasticsearch,
} from "../../configs/elasticsearch.config";

initElasticsearch({
  ELASTICSEARCH_IS_ENABLED: true,
});

const esClient = getElasticsearch();

const searchDocument = async ({ idxName, payload }: IElacticsearch) => {
  const result = await esClient?.search({
    index: idxName,
    body: payload,
  });

  console.log("Search::: ", result?.body?.hits?.hits);
};

const addDocument = async ({ idxName, payload, id }: IElacticsearch) => {
  try {
    const newDoc = await esClient?.index({
      index: idxName,
      body: payload,
      id,
    });
    console.log("newDoc:::", newDoc);
    return newDoc;
  } catch (error) {
    console.error("Error search Document ", error);
    return null;
  }
};

addDocument({
  idxName: "product_v001",
  id: "122333",
  payload: {
    title: "Samsung Galaxy S25 Ultra",
    price: 29999999,
    image: "...",
    category: "mobile",
  },
});

searchDocument({
  idxName: "product_v001",
  payload: {
    query: {
      match_all: {},
    },
  },
});

export { searchDocument, addDocument };
