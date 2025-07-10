import express, { Request, Response, NextFunction } from "express";

import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import instanceMongodb from "./databases/init.databases";
import { checkConnect } from "./helpers/check.connect";
import router from "./routes";
import bodyParser from "body-parser";
import { initRedis } from "./services/redis/redis.service";
import productServiceTest from "./tests/product.test";
import reidsPubSubService from "./services/redis/redisPubSub.service";
import inventoryServiceTest from "./tests/inventory.test";
const app: express.Application = express();

// connect redis
(async () => {
  await initRedis();
})();

// test pub/sub redis
(async () => {
  await reidsPubSubService.init();
  inventoryServiceTest;

  await productServiceTest.purchaseProduct({
    productId: "product:001",
    quantity: 10,
  });
})();
// init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init cors
// init db
instanceMongodb.connect("mongodb");
// checkConnect()

// init routes
app.use("", router);

// init error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    stack: err.stack,
    message: err.message,
  });
});

export { app };
