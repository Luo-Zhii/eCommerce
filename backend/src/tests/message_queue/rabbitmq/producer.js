const amqplib = require("amqplib/callback_api");
const queue = "tasks";

amqplib.connect("amqp://localhost", (err, conn) => {
  if (err) throw err;

  // Sender
  conn.createChannel((err, ch1) => {
    if (err) throw err;

    ch1.assertQueue(queue, {
      durable: true,
    });

    setInterval(() => {
      ch1.sendToQueue(queue, Buffer.from("something to do"));
      console.log("Sent...");
    }, 1000);
  });
});
