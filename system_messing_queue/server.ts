import { messageService } from "./src/services/consumerQueue.service";

const queueName = "tasks";

messageService
  .consumerToQueue(queueName)
  .then(() => {
    console.log(`Consumer started for queue: ${queueName}`);
  })
  .catch((error) => {
    console.error(`Failed to start consumer for queue ${queueName}:`, error);
  });
