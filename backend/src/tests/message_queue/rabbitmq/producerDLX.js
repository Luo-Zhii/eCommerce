const amqplib = require("amqplib");
const queue = "tasks";
const log = console.log;

console.log = function () {
  log.apply(console, [new Date()].concat(Array.from(arguments)));
};
(async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const notiExchange = "notiEx"; // notiExchange direct
    const notiQueue = "notiQueueProcess"; // assertQueue
    const notiExchangeDLX = "notiExDLX";
    const notiRoutingKeyDLX = "notiRoutingKeyDLX";

    // 1. create exchange
    await channel.assertExchange(notiExchange, "direct", {
      durable: true,
    });

    // 2. create  queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false,
      deadLetterExchange: notiExchangeDLX,
      deadLetterRoutingKey: notiRoutingKeyDLX,
    });

    // 3. bind queue
    await channel.bindQueue(queueResult.queue, notiExchange);

    // 4. send msg
    const msg = "noti: a new product";
    console.log("producer msg::", msg);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000",
    });

    setTimeout(() => {
      channel.close();
      connection.close();
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error(error);
  }
})();
