import { app } from "./app";

const PORT: number = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Xử lý tín hiệu dừng (Ctrl + C)
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
