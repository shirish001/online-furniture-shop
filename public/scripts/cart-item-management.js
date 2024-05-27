const cartItemUpdateFormElements = document.querySelectorAll(
  ".cart-item-management"
); // select all the form elements for all items in cart

const cartTotalPriceElement = document.getElementById("cart-total-price"); // total cart price element
const cartBadgeElements = document.querySelectorAll(".nav-items .badge"); // nav bar cart items shower

async function updateCartItem(event) {
  event.preventDefault(); // prevent the form from submitting (default behaviour first step in this ajax req)

  // this identifies by the form that actually triggered the event, inbuilt property
  const form = event.target; // accessing the element on which event(or action is performed)

  const productId = form.dataset.productid; // data set property we added explicitly
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value; // input element , all have value prop which is the value submitted

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        // these are used in controller func for this req prop name should match => req.body.productId, req.body.quantity
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json(); // response sent by the server , convert it back into js obj

  // after getting the response we need to update the cart
  // we need to update the cart in the frontend using DOM manipulation

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    // element has 0 price
    form.parentElement.parentElement.remove(); // remove the entire item
  } else {
    const cartItemTotalPriceElement =
      form.parentElement.querySelector(".cart-item-price");
    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent =
      responseData.updatedCartData.newTotalQuantity;
  }
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem); // event listener for each form element
}
