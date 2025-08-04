import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-dd hh:mm:ss.SS A",
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ dirname: "logs", filename: "test.log" }),
  ],
});

export default logger;
