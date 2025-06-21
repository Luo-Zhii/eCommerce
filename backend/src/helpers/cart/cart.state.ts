import { BadRequestError } from "../../core/error.response";

// Base state
export abstract class CartState {
  constructor(protected cart: any) {}

  abstract active(): void;
  abstract completed(): void;
  abstract failed(): void;
}

export class ActiveCart extends CartState {
  active() {
    console.log("active cart");
    this.cart.cart_state = "active";
  }
  completed() {
    console.log("completed cart");
    this.cart.cart_state = "completed";
  }

  failed() {
    console.log("Cancel cart");
    this.cart.cart_state = "failed";
  }
}

export class CompletedCart extends CartState {
  active() {
    console.log("active cart");
    this.cart.cart_state = "active";
  }
  completed() {
    console.log("Cart already completed");
  }
  failed() {
    console.log("Cannot cancel a completed cart");
  }
}

// Factory
export function createCartState(cart: any): CartState {
  switch (cart.cart_state) {
    case "active":
      return new ActiveCart(cart);
    case "completed":
      return new CompletedCart(cart);
    default:
      throw new BadRequestError("Unknown state");
  }
}
