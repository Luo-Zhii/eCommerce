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
import { v4 as uuidv4 } from "uuid";
import myloggerLog from "./logger/mylogger.log";

// // connect redis
// (async () => {
//   await initRedis();
// })();

// // test pub/sub redis
// (async () => {
//   await reidsPubSubService.init();
//   inventoryServiceTest;

//   await productServiceTest.purchaseProduct({
//     productId: "product:001",
//     quantity: 10,
//   });
// })();

// init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.use((req: Request, res: Response, next: NextFunction) => {
  const headerRequestId = req.headers["x-requestid"];
  // const requestId = Array.isArray(requestIdHeader) ? requestIdHeader[0] :requestIdHeader;
  const requestId =
    typeof headerRequestId === "string" ? headerRequestId : uuidv4();
  req.requestId = requestId;
  if ("password" in req.body) {
    req.body.password = "***";
  }
  myloggerLog.info({
    message: `input params:::${req.method}`,
    params: [
      { context: req.path },
      { requestId: req.requestId },
      req.method === "POST" ? req.body : req.query,
    ],
  });

  next();
});

// init cors
// init db
instanceMongodb.connect("mongodb");
// checkConnect()

// init routes
app.use("", router);

// init error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // console.error(err.stack);
  const start = (req as any).startTime || Date.now();
  const duration = Date.now() - start;
  const statusCode = (err as any).status || 500;
  const resMessage = `${statusCode}-${duration}ms-Response: ${JSON.stringify(
    err
  )}`;
  myloggerLog.error({
    message: resMessage,
    params: [
      {
        context: req.path,
      },
      {
        requestId: req.requestId,
      },
      {
        errorMessage: err.message,
      },
    ],
  });
  res.status(statusCode).json({
    status: "error",
    stack: err.stack,
    message: err.message,
  });
});

export { app };
