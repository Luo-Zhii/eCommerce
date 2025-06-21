interface CartObserver {
  update(cart: any): void;
}

class EmailObserver implements CartObserver {
  update(cart: any) {
    console.log(`[Email]:: Cart ${cart._id} updated.`);
  }
}

class LogObserver implements CartObserver {
  update(cart: any) {
    console.log(`[Log]:: Cart state is now ${cart.cart_state}`);
  }
}

class CartSubject {
  private observers: CartObserver[] = [];

  attach(observer: CartObserver) {
    this.observers.push(observer);
  }

  notify(cart: any) {
    for (const observer of this.observers) {
      observer.update(cart);
    }
  }
}

export { EmailObserver, LogObserver, CartSubject };
