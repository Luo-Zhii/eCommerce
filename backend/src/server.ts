import { app } from "./app";
import "dotenv/config";
import config from "./configs/config.mongodb";

let server: any; // Định nghĩa ở scope bên ngoài để SIGINT truy cập được

server = app.listen(config.app.port, () => {
  console.log(
    `${config.db.name} is running on http://${config.db.host}:${config.app.port}`
  );
});

// Xử lý tín hiệu dừng (Ctrl + C)
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
