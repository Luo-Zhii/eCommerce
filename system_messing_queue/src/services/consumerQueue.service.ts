import { connectToRabbitMQ, consumerQueue } from "../databases/init.rabbitmq";

const log = console.log;

console.log = function () {
  log.apply(console, [new Date()].concat(Array.from(arguments)));
};

const messageService = {
  consumerToQueue: async (queueName: string) => {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.log(`Error in consumerQueue: ${error}`);
    }
  },

  // case processing
  consumeToQueueNormal: async (queueName: string) => {
    const { connection, channel } = await connectToRabbitMQ();
    try {
      const notiQueue = "notiQueueProcess"; // assertQueue

      await channel.assertQueue(queueName);

      // TTL

      // const timeExpired = 5000;
      // setTimeout(() => {
      //   channel.consume(notiQueue, (msg) => {
      //     if (msg) {
      //       console.log(
      //         `SEND:::Received message from ${notiQueue}:`,
      //         msg.content.toString()
      //       );
      //       channel.ack(msg);
      //     }
      //   });
      // }, timeExpired);

      // Logic

      await channel.consume(notiQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log(`numberTest: ${numberTest}`);
          if (numberTest < 0.5) {
            throw new Error("Simulated processing error");
          }
          if (msg) {
            console.log(
              `SEND:::Received message from ${queueName}:`,
              msg.content.toString()
            );
            channel.ack(msg);
          }
        } catch (error) {
          if (msg) {
            channel.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      console.error(`Error in consumeToQueueNormal: ${error}`);
    }
  },

  // case failed processing
  consumeToQueueFailed: async (queueName: string) => {
    try {
      const { connection, channel } = await connectToRabbitMQ();

      const notiExchangeDLX = "notiExDLX";
      const notiRoutingKeyDLX = "notiRoutingKeyDLX";
      const notiQueueHandler = "notiQueueHotFix";

      await channel.assertExchange(notiExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notiExchangeDLX,
        notiRoutingKeyDLX
      );
      await channel.consume(
        queueResult.queue,
        (msg) => {
          if (msg) {
            console.log(
              `This noti ${notiQueueHandler} error, pls hot fix::::`,
              msg.content.toString()
            );
          }
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(`Error in consumeToQueueFailed: ${error}`);
    }
  },
};
export { messageService };
