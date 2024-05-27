const Product = require('./product.model');

class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    // items is an array
    this.items = items;
    this.totalQuantity = totalQuantity; // total qty of all products of different and same type
    this.totalPrice = totalPrice; // total price of all products of different and same type
  }

  async updatePrices() {
    const productIds = this.items.map(function (item) {
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds);

    const deletableCartItemProductIds = [];

    for (const cartItem of this.items) {
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;
      });

      if (!product) {
        // product was deleted!
        // "schedule" for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id);
        continue;
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0;
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  addItem(product) {
    const cartItem = {
      // the product property of the cartItem obj is being assigned the value of the product parameter that was passed to the addItem method
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    for (let i = 0; i < this.items.length; i++) {
      // array length
      const item = this.items[i];

      // checking if the product that was passed to the addItem method is already in the cart
      if (item.product.id === product.id) {
        // since object and arrays are reference based in js thats why we can edit them even if they are declared const (not string and numbers)

        cartItem.quantity = +item.quantity + 1; // updating the cartItem obj with cuurent item of loop
        cartItem.totalPrice = item.totalPrice + product.price; // same here

        // we are updating the quantity and totalPrice of the item that is already in the cart
        this.items[i] = cartItem;

        this.totalQuantity++; // increase the qty of cart object by 1
        this.totalPrice += product.price; // also inc its total price by the price of the product that was passed to the addItem method
        return;
      }
    }

    this.items.push(cartItem); // if item is not already present in cart push it into
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  // method to update the quantity of the item in the cart
  // we are supposed to get the item thru its product id and also get the new qty for it
  updateItem(productId, newQuantity) {
    // loop through the items array and check if the product id of the item is equal to the product id passed to the updateItem method
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item }; // creating a copy of the item object
        const quantityChange = newQuantity - item.quantity; // calculating the quantity change
        cartItem.quantity = newQuantity; // updating the quantity of the item
        cartItem.totalPrice = newQuantity * item.product.price; // updating the total price of the item
        this.items[i] = cartItem; // updating the item in the cart

        this.totalQuantity = this.totalQuantity + quantityChange; // updating the total qty of the cart
        this.totalPrice += quantityChange * item.product.price; // updating the total price of the cart
        return { updatedItemPrice: cartItem.totalPrice }; // returning the updated item price
      } else if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1); // removing the item from the cart, splice is method on array that removes the item from ith index till provided number
        this.totalQuantity = this.totalQuantity - item.quantity; // updating the total qty of the cart
        this.totalPrice -= item.totalPrice; // updating the total price of the cart
        return { updatedItemPrice: 0 }; // returning the updated item price
      }
    }
  }
}

module.exports = Cart;
