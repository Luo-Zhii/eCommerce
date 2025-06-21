import { BadRequestError, NotFoundError } from "../core/error.response";
import { ICheckout } from "../interface/interface";
import { findCartById } from "../models/repos/cart.repo";
import { checkProductByServer } from "../models/repos/product.repo";
import { discountService } from "./discount.service";

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
      console.log("checkProductServer:::", checkProductServer);

      // total price for each product
      const checkoutPrice = checkProductServer.reduce(
        (acc: number, product: any) => {
          return acc + product.quantity * product.price;
        },
        0
      );

      checkout_order.totalPrice += checkoutPrice;

      // total price before handle
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
        const { totalPrice = 0, discount = 0 } =
          await discountService.getDiscountAmount({
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
}

const checkoutService = new CheckoutService();
export default checkoutService;
