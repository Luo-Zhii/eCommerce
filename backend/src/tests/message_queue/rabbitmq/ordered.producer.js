const amqplib = require("amqplib");

async function producerOrderedMessage() {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queued-message";

  await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const msg = `ordered-queued-message:::${i}`;
    console.log(`message:::`, msg);
    await channel.sendToQueue(queueName, Buffer.from(msg), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  });
}
producerOrderedMessage().catch((error) => console.error(error));
