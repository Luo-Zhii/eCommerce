import { createClient } from "redis";
import { IRedisPubSub } from "../../interface/interface";

class ReidsPubSubService {
  private subscriber: any;
  private publisher: any;

  constructor() {
    this.publisher = createClient();
    this.subscriber = createClient();
  }
  async init() {
    if (!this.publisher.isOpen) await this.publisher.connect();
    if (!this.subscriber.isOpen) await this.subscriber.connect();
  }

  publish({ channel, message }: IRedisPubSub) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(
        channel,
        message,
        (error: Error | null, reply: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(reply);
          }
        }
      );
    });
  }

  async subscribe({ channel, callback }: IRedisPubSub) {
    await this.subscriber.subscribe(channel, (message: string) => {
      callback(channel, message);
    });
  }
}

const reidsPubSubService = new ReidsPubSubService();
export default reidsPubSubService;
