const amqplib = require("amqplib/callback_api");
const queue = "tasks";
const message = process.argv.slice(2).join(" ") || "something to do";

amqplib.connect("amqp://localhost", (err, conn) => {
  if (err) throw err;

  // Sender
  conn.createChannel((err, ch1) => {
    if (err) throw err;

    ch1.assertQueue(queue, {
      durable: true,
    });

    ch1.sendToQueue(queue, Buffer.from(message));
    console.log("Sent...");

    setTimeout(() => {
      ch1.close(() => {
        conn.close();
        process.exit(0);
      });
    }, 1000);
  });
});
