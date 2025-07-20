const amqplib = require("amqplib");

async function consumerOrderedMessage() {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queued-message";

  await channel.assertQueue(queueName, {
    durable: true,
  });

  // Set prefetch
  await channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const mess = msg.content.toString();

    setTimeout(() => {
      console.log("process:::", mess), channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch((error) => console.error(error));
