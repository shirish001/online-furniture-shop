const Cart = require('../models/cart.model');

function initializeCart(req, res, next) {
  let cart;

  if (!req.session.cart) { // if not exists that is for the first time 
    cart = new Cart(); // create a new cart obj with default values set in cart model constructor
  } else {
    // can add a new property to the req.session obj on the go
    const sessionCart = req.session.cart;
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity, // this was added after 578
      sessionCart.totalPrice // this too! since these prop were added later on cart constructor
    );
  }

  res.locals.cart = cart; // make this cart available to all the views for this req-res cycle

  next();
}

module.exports = initializeCart;