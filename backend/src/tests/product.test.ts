import { ILock } from "../interface/interface";
import reidsPubSubService from "../services/redis/redisPubSub.service";

class ProductServiceTest {
  purchaseProduct = ({ productId, quantity }: ILock) => {
    const order = { productId, quantity };
    console.log("-------product", productId);
    reidsPubSubService.publish({
      channel: "purchase_event",
      message: JSON.stringify(order),
    });
  };
}

const productServiceTest = new ProductServiceTest();
export default productServiceTest;
