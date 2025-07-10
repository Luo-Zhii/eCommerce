import { ILock } from "../interface/interface";
import reidsPubSubService from "../services/redis/redisPubSub.service";

class InventoryServiceTest {
  constructor() {
    reidsPubSubService.subscribe({
      channel: "purchase_event",
      callback: (channel: string, message: string) => {
        console.log("receive message", message);
        this.updateInventory(JSON.parse(message));
      },
    });
  }

  updateInventory({ productId, quantity }: ILock) {
    console.log(`Updated iventory ${productId} with quantity ${quantity}`);
  }
}

const inventoryServiceTest = new InventoryServiceTest();
export default inventoryServiceTest;
