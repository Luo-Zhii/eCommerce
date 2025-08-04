import winston, { createLogger } from "winston";
import "winston-daily-rotate-file";
import { ILogs } from "../interface/interface";
import { v4 as uuidv4 } from "uuid";

const { combine, timestamp, align, printf, json } = winston.format;
class MyLogger {
  logger: any;
  constructor() {
    const formatPrint = printf((info) => {
      const { level, message, timestamp, context, requestId, metadata } = info;
      return `${timestamp ?? ""} [${level}] [${context ?? ""}] [${
        requestId ?? ""
      }]: ${message} ${JSON.stringify(metadata ?? {})}`;
    });
    this.logger = createLogger({
      format: winston.format.combine(
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss.SS",
        }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          level: "info",
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: winston.format.combine(
            timestamp({
              format: "YYYY-MM-DD HH:mm:ss.SS",
            }),
            formatPrint
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: "error",
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: winston.format.combine(
            timestamp({
              format: "YYYY-MM-DD HH:mm:ss.SS",
            }),
            formatPrint
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: "warn",
          dirname: "src/logs",
          filename: "application-%DATE%.warn.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: winston.format.combine(
            timestamp({
              format: "YYYY-MM-DD HH:mm:ss.SS",
            }),
            formatPrint
          ),
        }),
      ],
    });
  }

  commonParams(params: ILogs) {
    let contextObj, reqObj, metadataObj;
    if (!Array.isArray(params)) {
      contextObj = params;
    } else {
      [contextObj, reqObj, metadataObj] = params;
    }

    let context = contextObj?.context || "unknown";
    let requestId = reqObj?.requestId || uuidv4();
    let metadata = metadataObj || {};

    return {
      requestId,
      context,
      metadata,
    };
  }

  info({ message, params }: ILogs) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramsLog);
    this.logger.info(logObject);
  }

  error({ message, params }: ILogs) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramsLog);
    this.logger.error(logObject);
  }

  warn({ message, params }: ILogs) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramsLog);
    this.logger.warn(logObject);
  }
}

export default new MyLogger();
