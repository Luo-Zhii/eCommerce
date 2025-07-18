import amqp from "amqplib";

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();
    const queue = "tasks";

    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from("Hello from test"));

    console.log("Message sent!");
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

const consumerQueue = async (channel: amqp.Channel, queueName: string) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in ${queueName}...`);

    channel.consume(
      queueName,
      (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
          console.log("msg:::", msg);
          console.log(
            `Received message ${queueName}: ${msg.content.toString()}`
          );
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error(`Error consuming from queue ${queueName}:`, error);
  }
};

export { connectToRabbitMQ, connectToRabbitMQForTest, consumerQueue };
