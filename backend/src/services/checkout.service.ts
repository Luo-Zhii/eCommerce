import { BadRequestError, NotFoundError } from "../core/error.response";
import { ICheckout, ILock, IOrder } from "../interface/interface";
import order from "../models/order.model";
import { deleteCart, findCartById } from "../models/repos/cart.repo";
import { checkProductByServer } from "../models/repos/product.repo";
import { discountService } from "./discount.service";
import { acquireLock, releaseLock } from "./redis.service";

class CheckoutService {
  // FE payload
  /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discount: [],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId,
                        }
                    ]
                },
                {
                    shopId,
                    shop_discount: [
                        {
                            shopId,
                            discountId,
                            codeId,
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId,
                        }
                    ]
                }
            ]
        }
    */

  async checkoutReview({ cartId, userId, shop_order_ids }: ICheckout) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new NotFoundError("Cart not found!!!");
    }

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    // calcu bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discount = [],
        item_products = [],
      } = shop_order_ids[i];

      // check product available
      const checkProductServer = await checkProductByServer(item_products);

      // total price for each product
      const checkoutPrice = checkProductServer.reduce(
        (acc: number, product: any) => {
          return acc + product.quantity * product.price;
        },
        0
      );

      checkout_order.totalPrice += checkoutPrice;

      // total price after handle (shop_order_ids)
      const itemCheckout = {
        shopId,
        shop_discounts: shop_discount,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // If shop_discount > 0 , check valid
      if (shop_discount.length > 0) {
        // if have only 1 discount
        // get amount discount
        const { discount = 0 } = await discountService.getDiscountAmount({
          codeId: shop_discount[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        // total price after apply discount sale
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // total price ended
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }: IOrder) {
    // 1. Check if the cart exists
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new NotFoundError("Cart not found!");
    }

    const cartItems = foundCart.cart_products.map((item: any) => ({
      productId: item.productId.toString(),
      quantity: item.quantity,
    }));

    const requestItems = shop_order_ids.flatMap(
      (order: any) => order.item_products
    );

    // 2. Validate that each requested product exists in the cart and has enough quantity
    for (const reqItem of requestItems) {
      const foundProductInCart = cartItems.find(
        (cartItem) =>
          cartItem.productId === reqItem.productId.toString() &&
          cartItem.quantity >= reqItem.quantity
      );

      if (!foundProductInCart) {
        throw new BadRequestError(
          `Product ${reqItem.productId} not found in cart or quantity is insufficient.`
        );
      }
    }

    // 3. Perform checkout review and prepare order data
    const { shop_order_ids_new, checkout_order } =
      await checkoutService.checkoutReview({ cartId, userId, shop_order_ids });

    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log("products:::", products);

    // 4. Acquire pessimistic lock for each product
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product) continue;
      const { productId, quantity }: ILock = product;
      const keyLock = await acquireLock({ productId, cartId, quantity });
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // 5. If any product failed to acquire lock, abort the process
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Oops, some products were updated. Please go back to the shop and try again."
      );
    }

    // 6. Create a new order
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: products,
      shop_order_ids: shop_order_ids_new,
    });

    // 7. If order is successfully created, remove purchased products from the cart
    if (newOrder) {
      for (const product of products) {
        if (!product) continue;
        const { productId }: ILock = product;
        await deleteCart({ userId, productId });
      }
    }

    return newOrder;
  }
}

const checkoutService = new CheckoutService();
export default checkoutService;
