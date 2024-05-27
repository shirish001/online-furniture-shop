const addToCartButtonElement = document.querySelector(
  "#product-details button"
); // add to cart button of product details
const cartBadgeElements = document.querySelectorAll(".nav-items .badge"); // the span element in nav-items.ejs in cart element which will show cart qty

async function addToCart() {
  // data-productid and data-csrf are attributes of the addToCart... button
  const productId = addToCartButtonElement.dataset.productid; // added so that we can extract productId which is being used in cart.controller.js
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;

  // since we are using fetch() we need to catch the error
  // ajax req also need to be checked in try catch block
  try {
    // since by default fetch() returns a promise
    response = await fetch("/cart/items", {
      method: "POST", // by default fetch() sends a GET request
      body: JSON.stringify({
        // this is how we send data to the server by converting js objects into json format
        productId: productId,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json", // this is how we tell the server that we are sending json data, for html forms this prop is set by default
      },
    });
  } catch (error) {
    // maybe connection is lost so we dont we get a response
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    // if response is not ok
    alert("Something went wrong!");
    return;
  }

  // this is how we get the response data, the json() method returns a promise
  // so we need to await the promise and it converts json data into regular js objects
  const responseData = await response.json();

  const newTotalQuantity = responseData.newTotalItems; // accessing the property of the json data

  // span was empty at start, its value is updated
  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = newTotalQuantity;
  }
}

addToCartButtonElement.addEventListener("click", addToCart);
