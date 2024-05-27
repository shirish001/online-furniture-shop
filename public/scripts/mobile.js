const mobileMenuBtnElement = document.getElementById('mobile-menu-btn'); // hamburger btn
const mobileMenuElement = document.getElementById('mobile-menu'); // aside element

function toggleMobileMenu() {

  // property returns a live DOMTokenList collection of the class attributes of the element. It allows you to add, remove, and toggle CSS classes on the element.
  mobileMenuElement.classList.toggle('open'); // classList attribute has toggle() method which adds or removes this "open" class(check navigation.css)
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);