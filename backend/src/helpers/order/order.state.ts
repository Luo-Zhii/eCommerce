import { BadRequestError } from "../../core/error.response";

// State Pattern
export abstract class OrderState {
  protected order: any;

  constructor(order: any) {
    this.order = order;
  }

  async transitionTo(newState: string): Promise<void> {
    throw new BadRequestError(
      `Transition to "${newState}" is not allowed from "${this.order.order_status}"`
    );
  }
}
export class PendingState extends OrderState {
  async transitionTo(newState: string) {
    switch (newState) {
      case "confirmed":
      case "cancelled":
        this.order.order_status = newState;
        await this.order.save();
        break;
      default:
        throw new BadRequestError(
          `Cannot transition from pending to ${newState}`
        );
    }
  }
}
export class ConfirmedState extends OrderState {
  async transitionTo(newState: string) {
    if (newState === "shipped") {
      this.order.order_status = newState;
      await this.order.save();
    } else {
      throw new BadRequestError(
        `Cannot transition from confirmed to ${newState}`
      );
    }
  }
}
export class ShippedState extends OrderState {
  async transitionTo(newState: string) {
    if (newState === "delivered") {
      this.order.order_status = newState;
      await this.order.save();
    } else {
      throw new BadRequestError(
        `Cannot transition from shipped to ${newState}`
      );
    }
  }
}
export class DeliveredState extends OrderState {
  async transitionTo(newState: string) {
    throw new BadRequestError(
      `Order already delivered. Cannot transition further.`
    );
  }
}
export class CancelledState extends OrderState {
  async transitionTo(newState: string) {
    throw new BadRequestError(`Order is cancelled. Cannot transition.`);
  }
}

// Factory Pattern
export const getOrderState = (order: any): OrderState => {
  switch (order.order_status) {
    case "pending":
      return new PendingState(order);
    case "confirmed":
      return new ConfirmedState(order);
    case "shipped":
      return new ShippedState(order);
    case "delivered":
      return new DeliveredState(order);
    case "cancelled":
      return new CancelledState(order);
    default:
      throw new BadRequestError(`Unknown order status: ${order.order_status}`);
  }
};
