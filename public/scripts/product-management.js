// This line selects all the "delete product" buttons on the page and stores them in the deleteProductButtonElements
const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
  const buttonElement = event.target; // This line gets the button element that was clicked.
  const productId = buttonElement.dataset.productid; // This line extracts the product ID from the button's data-productid attribute.
  const csrfToken = buttonElement.dataset.csrf; //This line extracts the CSRF token from the button's data-csrfattribute

  //This line sends a DELETE request to the server to delete the product with the given ID, passing the CSRF token as a query parameter.
  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    method: 'DELETE' // since by default fetch() sends a GET request
  });

  if (!response.ok) { // the .ok property is a boolean built-in property of the Response obj(promise) returned by fetch()
    alert('Something went wrong!');
    return;
  }
// This line removes the product element from the DOM. It does this by traversing up the DOM tree from the button element to the parent product element and then removing it.
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove(); // removes the li element
}

for (const deleteProductButtonElement of deleteProductButtonElements) { // this is how access to each delete element is achieved
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}