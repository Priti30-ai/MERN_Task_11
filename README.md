# Thala-7 Sneaker Store

A simple sneaker store website made using HTML, CSS and JavaScript.

## Pages

* **Home (index.html)** – store introduction and services
* **Product (product.html)** – product details, image gallery, quantity, Add to Cart
* **Cart (cart.html)** – cart items, quantity controls, coupon, totals
* **Payment (payment.html)** – payment form and order summary

## Features

* Product gallery – clicking a thumbnail updates the main product image
* Quantity selector on the product page is linked to the cart, so Add to Cart
  adds the exact quantity picked
* Cart is saved in the browser's `localStorage`, so items stay in the cart
  even after navigating between pages or refreshing
* Add / remove items and change quantity directly from the cart page
* Coupon codes checked against a small list of valid codes (`THALA7`,
  `WELCOME10`, `SEVEN50`) instead of one hardcoded value
* Subtotal, tax, discount and total are recalculated automatically
* Payment form validation (name, email, card number, expiry, CVV)
* On successful payment: cart is cleared and a success confirmation is shown
  on the page itself (not just an alert)
* Responsive layout (2 breakpoints: tablet/mobile and small mobile)

## Files

Thala-7-Sneaker-Store/
├── index.html
├── product.html
├── cart.html
├── payment.html
├── style.css
├── script.js
└── README.md

## How it works (cart storage)

The cart is kept as a JSON array in `localStorage` under the key
`thala7_cart`. Each item looks like:

```js
{ id: "shoe-1", name: "...", price: 1334, image: "...", qty: 2 }
```

* `product.html` reads the selected quantity and calls `addToCart()`
* `cart.html` reads the array, renders table rows, and re-saves it whenever
  quantity/remove buttons are used
* `payment.html` reads the array to build the order summary, and clears it
  (`localStorage.removeItem`) once payment validation passes

## How to Run

1. Download the project files.
2. Open the folder in VS Code (or any editor).
3. Open `index.html` in a browser, or use the Live Server extension.
