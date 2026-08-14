const CART_KEY = "thala7_cart";
const DISCOUNT_KEY = "thala7_discount";
const TAX_RATE = 0.05;

const coupons = [
    {
        code: "THALA7",
        type: "percentage",
        value: 10,
        minimumAmount: 1000,
        maximumDiscount: 300
    },
    {
        code: "WELCOME10",
        type: "fixed",
        value: 200,
        minimumAmount: 500,
        maximumDiscount: 200
    },
    {
        code: "SEVEN50",
        type: "percentage",
        value: 15,
        minimumAmount: 1500,
        maximumDiscount: 500
    }
];


function getCart() {
    const savedCart = localStorage.getItem(CART_KEY);

    if (savedCart) {
        return JSON.parse(savedCart);
    }

    return [];
}


function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


function formatRupees(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN");
}


function addProductToCart(product) {
    const cart = getCart();

    const existingProduct = cart.find(function (item) {
        return item.id === product.id;
    });

    if (existingProduct) {
        existingProduct.qty += product.qty;
    } else {
        cart.push(product);
    }

    saveCart(cart);
}


/* Product quantity */

const quantityDisplay = document.getElementById("productQty");
const quantityPlus = document.getElementById("qtyPlus");
const quantityMinus = document.getElementById("qtyMinus");

if (quantityDisplay && quantityPlus && quantityMinus) {

    quantityPlus.addEventListener("click", function () {
        let quantity = Number(quantityDisplay.textContent);

        quantity++;
        quantityDisplay.textContent = quantity;
    });

    quantityMinus.addEventListener("click", function () {
        let quantity = Number(quantityDisplay.textContent);

        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });
}


/* Add to cart */

const addToCartButton = document.getElementById("addToCartBtn");

if (addToCartButton) {

    addToCartButton.addEventListener("click", function () {

        const quantity = Number(
            document.getElementById("productQty").textContent
        );

        const product = {
            id: addToCartButton.dataset.id,
            name: addToCartButton.dataset.name,
            price: Number(addToCartButton.dataset.price),
            image: addToCartButton.dataset.image,
            qty: quantity
        };

        addProductToCart(product);

        const message = document.getElementById("addToCartMsg");

        if (message) {
            message.textContent = "Product added to cart.";
        }
    });
}


/* Product gallery */

const mainProductImage =
    document.getElementById("mainProductImage");

const thumbnails =
    document.querySelectorAll(".gallery-thumb");

if (mainProductImage && thumbnails.length > 0) {

    thumbnails.forEach(function (thumbnail) {

        thumbnail.addEventListener("click", function () {

            mainProductImage.src = thumbnail.src;

            thumbnails.forEach(function (item) {
                item.classList.remove("active-thumb");
            });

            thumbnail.classList.add("active-thumb");
        });
    });
}


/* Gallery buttons */

const productGallery =
    document.getElementById("productGallery");

const galleryLeftButton =
    document.querySelector(".gallery-left");

const galleryRightButton =
    document.querySelector(".gallery-right");

if (
    productGallery &&
    galleryLeftButton &&
    galleryRightButton
) {

    galleryLeftButton.addEventListener("click", function () {
        productGallery.scrollLeft -= 220;
    });

    galleryRightButton.addEventListener("click", function () {
        productGallery.scrollLeft += 220;
    });
}


/* Coupon */

function findCoupon(code) {

    for (let i = 0; i < coupons.length; i++) {

        if (coupons[i].code === code) {
            return coupons[i];
        }
    }

    return null;
}


function calculateDiscount(coupon, subtotal) {

    if (!coupon || subtotal < coupon.minimumAmount) {
        return 0;
    }

    let discount;

    if (coupon.type === "percentage") {
        discount = subtotal * coupon.value / 100;
    } else {
        discount = coupon.value;
    }

    if (discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
    }

    return Math.round(discount);
}


/* Cart page */

const cartTableBody =
    document.getElementById("cartTableBody");

if (cartTableBody) {

    let currentDiscount =
        Number(localStorage.getItem(DISCOUNT_KEY) || 0);

    const couponInput =
        document.querySelector(".coupon-input");

    const couponButton =
        document.querySelector(".coupon-button");

    const couponMessage =
        document.getElementById("couponMessage");


    function renderCart() {

        const cart = getCart();

        cartTableBody.innerHTML = "";

        const emptyMessage =
            document.getElementById("emptyCartMsg");

        if (emptyMessage) {

            if (cart.length === 0) {
                emptyMessage.style.display = "block";
            } else {
                emptyMessage.style.display = "none";
            }
        }


        cart.forEach(function (item) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.name}</td>

                <td>${formatRupees(item.price)}</td>

                <td>
                    <div class="cart-quantity">
                        <button
                            class="quantity-minus"
                            type="button">−</button>

                        <span>${item.qty}</span>

                        <button
                            class="quantity-plus"
                            type="button">+</button>
                    </div>
                </td>

                <td>${formatRupees(item.price * item.qty)}</td>

                <td>
                    <button
                        class="remove-btn"
                        type="button">×</button>
                </td>
            `;


            const plusButton =
                row.querySelector(".quantity-plus");

            const minusButton =
                row.querySelector(".quantity-minus");

            const removeButton =
                row.querySelector(".remove-btn");


            plusButton.addEventListener("click", function () {

                item.qty++;

                saveCart(cart);
                renderCart();
            });


            minusButton.addEventListener("click", function () {

                if (item.qty > 1) {

                    item.qty--;

                    saveCart(cart);
                    renderCart();
                }
            });


            removeButton.addEventListener("click", function () {

                const newCart = cart.filter(function (cartItem) {
                    return cartItem.id !== item.id;
                });

                saveCart(newCart);

                currentDiscount = 0;
                localStorage.removeItem(DISCOUNT_KEY);

                if (couponMessage) {
                    couponMessage.textContent = "";
                }

                renderCart();
            });


            cartTableBody.appendChild(row);
        });


        updateCartSummary(cart);
    }


    function updateCartSummary(cart) {

        let subtotal = 0;

        cart.forEach(function (item) {
            subtotal += item.price * item.qty;
        });


        if (currentDiscount > subtotal) {
            currentDiscount = 0;
            localStorage.removeItem(DISCOUNT_KEY);
        }


        const tax =
            Math.round(subtotal * TAX_RATE);

        const total =
            Math.max(
                0,
                subtotal + tax - currentDiscount
            );


        const subtotalElement =
            document.querySelector(".subtotal");

        const taxElement =
            document.querySelector(".tax");

        const discountElement =
            document.querySelector(".discount");

        const totalElement =
            document.querySelector(".total-amount");

        const payAmountElement =
            document.querySelector(".pay-amount");


        if (subtotalElement) {
            subtotalElement.textContent =
                formatRupees(subtotal);
        }

        if (taxElement) {
            taxElement.textContent =
                formatRupees(tax);
        }

        if (discountElement) {
            discountElement.textContent =
                formatRupees(currentDiscount);
        }

        if (totalElement) {
            totalElement.textContent =
                formatRupees(total);
        }

        if (payAmountElement) {
            payAmountElement.textContent =
                formatRupees(total);
        }


        const payButton =
            document.querySelector(".pay-now");

        if (payButton) {

            if (cart.length === 0) {
                payButton.style.pointerEvents = "none";
                payButton.style.opacity = "0.5";
            } else {
                payButton.style.pointerEvents = "auto";
                payButton.style.opacity = "1";
            }
        }
    }


    if (couponButton) {

        couponButton.addEventListener("click", function () {

            const enteredCode =
                couponInput.value.trim().toUpperCase();

            const cart = getCart();

            let subtotal = 0;

            cart.forEach(function (item) {
                subtotal += item.price * item.qty;
            });


            if (cart.length === 0) {

                currentDiscount = 0;
                localStorage.removeItem(DISCOUNT_KEY);

                couponMessage.textContent =
                    "Your cart is empty.";

                couponMessage.style.color = "red";

                renderCart();
                return;
            }


            const selectedCoupon =
                findCoupon(enteredCode);


            if (!selectedCoupon) {

                currentDiscount = 0;
                localStorage.removeItem(DISCOUNT_KEY);

                couponMessage.textContent =
                    "Invalid coupon code.";

                couponMessage.style.color = "red";

                renderCart();
                return;
            }


            if (subtotal < selectedCoupon.minimumAmount) {

                currentDiscount = 0;
                localStorage.removeItem(DISCOUNT_KEY);

                couponMessage.textContent =
                    "Minimum purchase is " +
                    formatRupees(
                        selectedCoupon.minimumAmount
                    ) +
                    ".";

                couponMessage.style.color = "red";

                renderCart();
                return;
            }


            currentDiscount =
                calculateDiscount(
                    selectedCoupon,
                    subtotal
                );


            localStorage.setItem(
                DISCOUNT_KEY,
                currentDiscount
            );


            couponMessage.textContent =
                "Coupon applied. Discount: " +
                formatRupees(currentDiscount);

            couponMessage.style.color = "#45a86b";

            renderCart();
        });
    }


    renderCart();
}


/* Payment page */

const paymentForm =
    document.querySelector(".payment-form");

if (paymentForm) {

    const orderProductList =
        document.getElementById("orderProductList");


    function showOrderSummary() {

        const cart = getCart();

        orderProductList.innerHTML = "";

        let subtotal = 0;


        if (cart.length === 0) {

            orderProductList.innerHTML = `
                <p class="empty-cart-msg">
                    Your cart is empty.
                    <a href="product.html">
                        Go shopping →
                    </a>
                </p>
            `;

        } else {

            cart.forEach(function (item) {

                subtotal += item.price * item.qty;

                const productDiv =
                    document.createElement("div");

                productDiv.classList.add("order-product");

                productDiv.innerHTML = `
                    <img
                        src="${item.image}"
                        alt="${item.name}">

                    <div>
                        <h3>${item.name}</h3>

                        <p>
                            Quantity: ${item.qty}
                        </p>

                        <strong>
                            ${formatRupees(
                    item.price * item.qty
                )}
                        </strong>
                    </div>
                `;

                orderProductList.appendChild(productDiv);
            });
        }


        const tax =
            Math.round(subtotal * TAX_RATE);

        const discount =
            Number(
                localStorage.getItem(DISCOUNT_KEY) || 0
            );

        const total =
            Math.max(
                0,
                subtotal + tax - discount
            );


        const paymentSubtotal =
            document.querySelector(".payment-subtotal");

        const paymentTotal =
            document.querySelector(".payment-total");

        const paymentAmount =
            document.querySelector(".payment-pay-amount");


        if (paymentSubtotal) {
            paymentSubtotal.textContent =
                formatRupees(subtotal);
        }

        if (paymentTotal) {
            paymentTotal.textContent =
                formatRupees(total);
        }

        if (paymentAmount) {
            paymentAmount.textContent =
                formatRupees(total);
        }
    }


    showOrderSummary();


    const paymentOptions =
        document.querySelectorAll(".payment-option");


    paymentOptions.forEach(function (option) {

        option.addEventListener("click", function () {

            paymentOptions.forEach(function (button) {
                button.classList.remove("active");
            });

            option.classList.add("active");
        });
    });


    paymentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const cart = getCart();


        if (cart.length === 0) {

            alert("Your cart is empty.");
            return;
        }


        const email =
            document.getElementById("email").value.trim();

        const cardName =
            document.getElementById("card-name").value.trim();

        const cardNumber =
            document.getElementById("card-number").value.trim();

        const expiry =
            document.getElementById("expiry").value.trim();

        const cvv =
            document.getElementById("cvv").value.trim();


        if (email === "") {

            alert("Please enter your email.");
            return;
        }


        if (!email.includes("@") || !email.includes(".")) {

            alert("Please enter a valid email.");
            return;
        }


        if (cardName === "") {

            alert("Please enter the card holder name.");
            return;
        }


        if (!/^[0-9]{16}$/.test(cardNumber)) {

            alert("Card number must contain 16 digits.");
            return;
        }


        if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) {

            alert("Use MM/YY format for expiry date.");
            return;
        }


        if (!/^[0-9]{3}$/.test(cvv)) {

            alert("CVV must contain 3 digits.");
            return;
        }


        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(DISCOUNT_KEY);


        const paymentWrapper =
            document.getElementById("paymentFormWrapper");

        const paymentSuccess =
            document.getElementById("paymentSuccess");


        if (paymentWrapper) {
            paymentWrapper.style.display = "none";
        }

        if (paymentSuccess) {
            paymentSuccess.style.display = "block";
        }
    });
}