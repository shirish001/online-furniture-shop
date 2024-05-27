const Product = require("../models/product.model");

function getCart(req, res) {
  res.render("customer/cart/cart"); // dont have to pass any obj ass locals.cart is used
}

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart; // the one we created in the middleware

  cart.addItem(product); // the method defined in cart model to add item
  req.session.cart = cart; // saving the updated cart in the session collection, no save() because we do not redirect

  // sending a response to the client after the req is processed in json format(since this route was triggered thru ajax req)
  res.status(201).json({
    message: "Cart updated!",
    newTotalItems: cart.totalQuantity,
  });
}

function updateCartItem(req, res) {
  // accessing the cart instance of class model for current req-res cycle
  const cart = res.locals.cart; 

  // returned prop from updateItem() are stored in updatedItemData
  const updatedItemData = cart.updateItem(
    req.body.productId, // from patch req
    +req.body.quantity // will get from the patch req
  );

  req.session.cart = cart; // again updating the cart data in session

  // json response bc this controller is for a route triggred by ajax req
  res.json({
    message: "Item updated!",
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
