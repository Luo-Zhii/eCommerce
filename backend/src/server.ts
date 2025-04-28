import { app } from "./app";
import 'dotenv/config'
import config from "./configs/config.mongodb"; 

const server = app.listen(config.app.port, () => {
  console.log(`Server is running on http://${config.db.host}:${config.app.port}`);
});

// Xử lý tín hiệu dừng (Ctrl + C)
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
