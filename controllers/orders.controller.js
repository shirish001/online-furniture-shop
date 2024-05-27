const Order = require("../models/order.model");
const User = require("../models/user.model");

//
const stripe = require("stripe")(
  "sk_test_51PL6wASAzdVdx4mQYSphDbxArYmFSsUjRpvBrLsald2FOeHr1ychRWeacFmjT8Ov4ye6jN0IWhPRjTWhxNbG3XFG00NqQzXxZl"
);

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart; // getting the cart from the locals

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid); // finding the user document
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument); // creating a new order

  try {
    await order.save(); // saving the order in database
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null; //so that before directing we could empty the cart

  // since we will be sending about cart items from our own db, we will use  locals.cart...

  // stripe obj that we got after requiring its package, calling checkout obj on it then sessions obj and then create method on sessions...
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], // payment method types
    line_items: cart.items.map(function (item) {
      // mapping the items in the cart so that each item in cart(array) can have these stripe standard prop

      //The return statement specifies the value to be added to the new array
      //Without the return statement, the function would not have any output, and undefined would be added to the new array for each element in the original array.
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price.toFixed(2) * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);

  // res.redirect("/orders"); // commented out after adding stripe functionality
}

function getSuccess(req, res) {
  res.render("customer/orders/success");
}

function getFailure(req, res) {
  res.render("customer/orders/failure");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
