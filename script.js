// ===============================
// PRODUCT QUANTITY
// ===============================

let productQuantity = 1;

const minusButton = document.getElementById("qtyMinus");
const plusButton = document.getElementById("qtyPlus");
const quantityText = document.getElementById("productQty");

if (minusButton && plusButton) {

    minusButton.addEventListener("click", function () {

        if (productQuantity > 1) {
            productQuantity = productQuantity - 1;
            quantityText.textContent = productQuantity;
        }

    });

    plusButton.addEventListener("click", function () {

        productQuantity = productQuantity + 1;
        quantityText.textContent = productQuantity;

    });
}


// ===============================
// ADD PRODUCT TO CART
// ===============================

const addCartButton = document.getElementById("addToCartBtn");

if (addCartButton) {

    addCartButton.addEventListener("click", function () {

        const productId = addCartButton.dataset.id;
        const productName = addCartButton.dataset.name;
        const productPrice = Number(addCartButton.dataset.price);
        const productImage = addCartButton.dataset.image;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let productFound = false;

        for (let i = 0; i < cart.length; i++) {

            if (cart[i].id === productId) {

                cart[i].quantity =
                    cart[i].quantity + productQuantity;

                productFound = true;
                break;
            }
        }

        if (productFound === false) {

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: productQuantity
            };

            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        const message = document.getElementById("addToCartMsg");

        if (message) {
            message.textContent = "Product added to cart!";
        }

    });
}


// ===============================
// SHOW CART
// ===============================

function showCart() {

    const cartBody = document.getElementById("cartTableBody");

    if (!cartBody) {
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartBody.innerHTML = "";

    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {

        const item = cart[i];

        const itemTotal = item.price * item.quantity;

        subtotal = subtotal + itemTotal;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="cart-product">
                    <img src="${item.image}" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            </td>

            <td>₹${item.price}</td>

            <td>
                <div class="cart-quantity">

                    <button
                        type="button"
                        class="minus-cart"
                        data-id="${item.id}">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="plus-cart"
                        data-id="${item.id}">
                        +
                    </button>

                </div>
            </td>

            <td>₹${itemTotal}</td>

            <td>
                <button
                    type="button"
                    class="remove-btn"
                    data-id="${item.id}">
                    ×
                </button>
            </td>
        `;

        cartBody.appendChild(row);
    }

    if (cart.length === 0) {

        const emptyMessage =
            document.getElementById("emptyCartMsg");

        if (emptyMessage) {
            emptyMessage.style.display = "block";
        }

    } else {

        const emptyMessage =
            document.getElementById("emptyCartMsg");

        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }
    }

    calculateCartTotal(subtotal);
}


// ===============================
// CART TOTAL
// ===============================

let discount = 0;

function calculateCartTotal(subtotal) {

    const tax = subtotal * 0.05;

    const total = subtotal + tax - discount;

    const subtotalText =
        document.querySelector(".subtotal");

    const taxText =
        document.querySelector(".tax");

    const discountText =
        document.querySelector(".discount");

    const totalText =
        document.querySelector(".total-amount");

    const payAmount =
        document.querySelector(".pay-amount");

    if (subtotalText) {
        subtotalText.textContent =
            "₹" + Math.round(subtotal);
    }

    if (taxText) {
        taxText.textContent =
            "₹" + Math.round(tax);
    }

    if (discountText) {
        discountText.textContent =
            "₹" + Math.round(discount);
    }

    if (totalText) {
        totalText.textContent =
            "₹" + Math.round(total);
    }

    if (payAmount) {
        payAmount.textContent =
            "₹" + Math.round(total);
    }
}


// ===============================
// CART BUTTONS
// ===============================

const cartBody = document.getElementById("cartTableBody");

if (cartBody) {

    cartBody.addEventListener("click", function (event) {

        const clickedButton = event.target;

        const productId = clickedButton.dataset.id;

        if (!productId) {
            return;
        }

        let cart =
            JSON.parse(localStorage.getItem("cart")) || [];


        // Increase quantity
        if (clickedButton.classList.contains("plus-cart")) {

            for (let i = 0; i < cart.length; i++) {

                if (cart[i].id === productId) {

                    cart[i].quantity =
                        cart[i].quantity + 1;

                    break;
                }
            }
        }


        // Decrease quantity
        if (clickedButton.classList.contains("minus-cart")) {

            for (let i = 0; i < cart.length; i++) {

                if (cart[i].id === productId) {

                    if (cart[i].quantity > 1) {

                        cart[i].quantity =
                            cart[i].quantity - 1;
                    }

                    break;
                }
            }
        }


        // Remove product
        if (clickedButton.classList.contains("remove-btn")) {

            let newCart = [];

            for (let i = 0; i < cart.length; i++) {

                if (cart[i].id !== productId) {
                    newCart.push(cart[i]);
                }
            }

            cart = newCart;
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        showCart();

    });
}


// ===============================
// COUPON
// ===============================

const couponButton =
    document.querySelector(".coupon-button");

if (couponButton) {

    couponButton.addEventListener("click", function () {

        const couponInput =
            document.getElementById("coupon");

        const couponMessage =
            document.getElementById("couponMessage");

        const code =
            couponInput.value.trim().toUpperCase();

        let cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        let subtotal = 0;

        for (let i = 0; i < cart.length; i++) {

            subtotal =
                subtotal +
                (cart[i].price * cart[i].quantity);
        }


        if (code === "SAVE10") {

            discount = subtotal * 0.10;

            couponMessage.textContent =
                "10% discount applied!";

            couponMessage.style.color = "green";

        } else {

            discount = 0;

            couponMessage.textContent =
                "Invalid coupon code.";

            couponMessage.style.color = "red";
        }

        calculateCartTotal(subtotal);

    });
}


// ===============================
// PRODUCT IMAGE GALLERY
// ===============================

const galleryImages =
    document.querySelectorAll(".gallery-thumb");

const mainProductImage =
    document.getElementById("mainProductImage");

galleryImages.forEach(function (image) {

    image.addEventListener("click", function () {

        if (mainProductImage) {

            mainProductImage.src =
                image.src;
        }

        galleryImages.forEach(function (item) {

            item.classList.remove("active-thumb");

        });

        image.classList.add("active-thumb");

    });

});


// ===============================
// GALLERY LEFT AND RIGHT BUTTONS
// ===============================

const productGallery =
    document.getElementById("productGallery");

const galleryLeft =
    document.querySelector(".gallery-left");

const galleryRight =
    document.querySelector(".gallery-right");

if (productGallery && galleryLeft && galleryRight) {

    galleryLeft.addEventListener("click", function () {

        productGallery.scrollLeft =
            productGallery.scrollLeft - 200;

    });

    galleryRight.addEventListener("click", function () {

        productGallery.scrollLeft =
            productGallery.scrollLeft + 200;

    });
}


// ===============================
// PAYMENT ORDER SUMMARY
// ===============================

function showPaymentDetails() {

    const productList =
        document.getElementById("orderProductList");

    if (!productList) {
        return;
    }

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    productList.innerHTML = "";

    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {

        const item = cart[i];

        const itemTotal =
            item.price * item.quantity;

        subtotal =
            subtotal + itemTotal;

        productList.innerHTML += `
            <div class="order-product">

                <img
                    src="${item.image}"
                    alt="${item.name}">

                <div>
                    <h3>${item.name}</h3>

                    <p>
                        Quantity: ${item.quantity}
                    </p>

                    <strong>
                        ₹${itemTotal}
                    </strong>
                </div>

            </div>
        `;
    }

    const paymentSubtotal =
        document.querySelector(".payment-subtotal");

    const paymentTotal =
        document.querySelector(".payment-total");

    const paymentAmount =
        document.querySelector(".payment-pay-amount");

    if (paymentSubtotal) {
        paymentSubtotal.textContent =
            "₹" + Math.round(subtotal);
    }

    if (paymentTotal) {
        paymentTotal.textContent =
            "₹" + Math.round(subtotal);
    }

    if (paymentAmount) {
        paymentAmount.textContent =
            "₹" + Math.round(subtotal);
    }
}

showPaymentDetails();


// ===============================
// PAYMENT OPTIONS
// ===============================

const paymentOptions =
    document.querySelectorAll(".payment-option");

paymentOptions.forEach(function (button) {

    button.addEventListener("click", function () {

        paymentOptions.forEach(function (item) {

            item.classList.remove("active");

        });

        button.classList.add("active");

    });

});


// ===============================
// PAYMENT FORM
// ===============================

const paymentForm =
    document.querySelector(".payment-form");

if (paymentForm) {

    paymentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email");

        const cardName =
            document.getElementById("card-name");

        const cardNumber =
            document.getElementById("card-number");

        const expiry =
            document.getElementById("expiry");

        const cvv =
            document.getElementById("cvv");


        if (
            email.value === "" ||
            cardName.value === "" ||
            cardNumber.value === "" ||
            expiry.value === "" ||
            cvv.value === ""
        ) {

            alert("Please fill all the fields.");

            return;
        }


        const paymentFormWrapper =
            document.getElementById("paymentFormWrapper");

        const paymentSuccess =
            document.getElementById("paymentSuccess");


        paymentFormWrapper.style.display =
            "none";

        paymentSuccess.style.display =
            "block";

        localStorage.removeItem("cart");

    });
}


// ===============================
// RUN CART
// ===============================

showCart();