import { NotFoundError } from "../../core/error.response";
import { ICart } from "../../interface/interface";
import cart from "../cart.model";
import deletedCart from "../deletedCart.model";
const createUserCart = async ({ userId, product }: ICart) => {
  const query = { cart_userId: userId, cart_state: "active" },
    updateToInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };
  return await cart.findOneAndUpdate(query, updateToInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }: ICart) => {
  const { productId, quantity } = product;

  const userCart = await cart.findOne({
    cart_userId: userId,
    cart_state: "active",
  });

  if (!userCart) {
    throw new NotFoundError("User cart not found");
  }

  const existingProduct = userCart.cart_products.find(
    (p: any) => p.productId.toString() === productId.toString()
  );

  let updatedCart;

  if (existingProduct) {
    updatedCart = await cart.findOneAndUpdate(
      {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.productId": productId,
      },
      {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      { new: true }
    );
  } else {
    updatedCart = await cart.findOneAndUpdate(
      {
        cart_userId: userId,
        cart_state: "active",
      },
      {
        $push: {
          cart_products: product,
        },
      },
      { new: true }
    );
  }

  const countProduct = updatedCart?.cart_products?.length || 0;

  await cart.updateOne(
    {
      cart_userId: userId,
      cart_state: "active",
    },
    {
      $set: {
        cart_count_product: countProduct,
      },
    }
  );

  return await cart
    .findOne({
      cart_userId: userId,
      cart_state: "active",
    })
    .lean();
};

const deleteCart = async ({ userId, productId }: ICart) => {
  const query = { cart_userId: userId, cart_state: "active" };

  // 1. Find the current cart
  const currentCart = await cart.findOne(query);
  if (!currentCart) throw new NotFoundError("Cart not found");

  // 2. Check if the cart has only one product and it is being removed => delete the entire cart
  const isDeletingAll =
    currentCart.cart_products.length === 1 &&
    currentCart.cart_products[0].productId === productId;

  // 3. Archive the deleted product(s)
  await deletedCart.create({
    cart_userId: currentCart.cart_userId,
    cart_products: isDeletingAll ? currentCart.cart_products : [productId],
    cart_count_product: currentCart.cart_count_product,
    cart_state: currentCart.cart_state,
  });

  if (isDeletingAll) {
    await cart.deleteOne({ _id: currentCart._id });
    return { message: "Cart deleted and archived" };
  }

  // 4. Remove the product
  await cart.updateOne(query, {
    $pull: {
      cart_products: { productId },
    },
  });

  // 5. Recalculate cart_count_product
  const updatedCart = await cart.findOne(query);
  const countProduct = updatedCart?.cart_products?.length || 0;

  await cart.updateOne(query, {
    $set: {
      cart_count_product: countProduct,
    },
  });

  return { message: "Product removed and cart updated" };
};

const removeCart = async ({ userId, product, state = "active" }: ICart) => {
  const updatedCart = await cart.findOneAndUpdate(
    {
      cart_userId: userId,
      cart_state: "active",
    },
    {
      $pull: {
        cart_products: { product },
      },
      $inc: { cart_count_product: -1 },
    },
    { new: true }
  );

  return updatedCart;
};

export { createUserCart, updateUserCartQuantity, deleteCart, removeCart };
