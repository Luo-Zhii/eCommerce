import { connectToRabbitMQ, consumerQueue } from "../databases/init.rabbitmq";

const messageService = {
  consumerToQueue: async (queueName: string) => {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.log(`Error in consumerQueue: ${error}`);
    }
  },
};
export { messageService };
