import { messageService } from "./src/services/consumerQueue.service";

const queueName = "tasks";

// messageService
//   .consumerToQueue(queueName)
//   .then(() => {
//     console.log(`Consumer started for queue: ${queueName}`);
//   })
//   .catch((error) => {
//     console.error(`Failed to start consumer for queue ${queueName}:`, error);
//   });

messageService
  .consumeToQueueNormal(queueName)
  .then(() => {
    console.log(`consumeToQueueNormal started for queue`);
  })
  .catch((error) => {
    console.error(`Failed to start consumeToQueueNormal for queue:`, error);
  });

messageService
  .consumeToQueueFailed(queueName)
  .then(() => {
    console.log(`consumeToQueueFailed started for queue`);
  })
  .catch((error) => {
    console.error(`Failed to start consumeToQueueFailed for queue:`, error);
  });
