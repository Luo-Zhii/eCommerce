/**
 * Cart Service
 * 1 - add product to cart [user]
 * 2 - reduce product quantity by one [user]
 * 3 - inc product quantity by one [user]
 * 4 - get cart [user]
 * 5 - delete cart [user]
 * 6 - delete cart item [user]
 */

import { Types } from "mongoose";
import { BadRequestError, NotFoundError } from "../core/error.response";
import {
  CartSubject,
  EmailObserver,
  LogObserver,
} from "../helpers/cart/cart.observer";
import { createCartState } from "../helpers/cart/cart.state";
import { ICart } from "../interface/interface";
import cart from "../models/cart.model";
import {
  createUserCart,
  deleteCart,
  removeCart,
  updateUserCartQuantity,
} from "../models/repos/cart.repo";
import { getProductById } from "../models/repos/product.repo";
import { convertToObjectIdMongodb } from "../utils";

const cartSubject = new CartSubject();
cartSubject.attach(new EmailObserver());
cartSubject.attach(new LogObserver());

class CartService {
  async performCartAction({ cartId, state }: ICart) {
    const cartDoc = await cart.findById(cartId);
    if (!cartDoc) throw new BadRequestError("Cart not found");

    const handler = createCartState(cartDoc);

    switch (state) {
      case "active":
        handler.active();
        break;

      case "completed":
        handler.completed();
        break;

      case "failed":
        handler.failed();
        break;

      default:
        throw new BadRequestError("Invalid cart state action.");
    }

    await cartDoc.save();

    // notify side-effects
    cartSubject.notify(cartDoc);
  }

  async addToCart({ userId, product = {} }: ICart) {
    // check cart exists ?
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      // create cart for user
      return await createUserCart({ userId, product });
    }

    // if cart but haven't product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // cart exists and have product update quantity
    return await updateUserCartQuantity({ userId, product });
  }

  // update cart
  /* fe send: 
  
    shop_order_ids: [
        {
            shopId,
            item_products: [
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId
                }
            ],
            version
        }
    ]
  */

  async updateToCart({ userId, shop_order_ids }: ICart) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0] || {};

    // check product
    const foundProduct = await getProductById(productId);

    if (!foundProduct) {
      throw new NotFoundError("foundProduct not found!!!");
    }

    if (quantity === 0) {
      return await deleteCart({
        userId,
        product: shop_order_ids?.item_products?.productId,
      });
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  async deleteCart({ userId, productId }: ICart) {
    return await deleteCart({ userId, productId });
  }

  async getListUserCart({ userId }: ICart) {
    console.log(userId);
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

export const cartService = new CartService();
