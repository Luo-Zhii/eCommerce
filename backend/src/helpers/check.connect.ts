import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECOND = 5000;
// Count connect
const countConnect = () => {
  const numberConnect = mongoose.connections.length;
  console.log("Number of connect: ", numberConnect);
};

const checkConnect = () => {
  setInterval(() => {
    const numConnect = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numCores * 5;

    console.log("Active connections: ", numConnect);
    console.log("Memory usage: ", memoryUsage / 1024 / 1024, 'MB');

    if (numConnect > maxConnections) {
      console.log("Connection overload detected!!!");
    }
  }, _SECOND);
};

export  {countConnect, checkConnect};
