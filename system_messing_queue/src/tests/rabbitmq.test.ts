import { connectToRabbitMQForTest } from "../databases/init.rabbitmq";

describe("RabbitMQ Connection", () => {
  it("should connect to successfull RabbitMQ", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
