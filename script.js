const CART_KEY = "thala7_cart";
const TAX_RATE = 0.05;

const COUPONS = {
    THALA7: 500,
    WELCOME10: 300,
    SEVEN50: 750
};

function getCart() {
    const data = localStorage.getItem(CART_KEY);

    try {
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatRupees(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function addToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.qty += product.qty;
    } else {
        cart.push(product);
    }

    saveCart(cart);
}

/* PRODUCT PAGE */

const mainImage = document.getElementById("mainProductImage");

if (mainImage) {
    const thumbnails = document.querySelectorAll(".gallery-thumb");
    const quantityDisplay = document.getElementById("productQty");
    const quantityMinus = document.getElementById("qtyMinus");
    const quantityPlus = document.getElementById("qtyPlus");
    const addToCartButton = document.getElementById("addToCartBtn");
    const addToCartMessage = document.getElementById("addToCartMsg");

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener("click", () => {
            mainImage.src = thumbnail.src;

            thumbnails.forEach(item => {
                item.classList.remove("active-thumb");
            });

            thumbnail.classList.add("active-thumb");
        });
    });

    quantityPlus.addEventListener("click", () => {
        const currentQuantity = parseInt(quantityDisplay.textContent, 10);
        quantityDisplay.textContent = currentQuantity + 1;
    });

    quantityMinus.addEventListener("click", () => {
        const currentQuantity = parseInt(quantityDisplay.textContent, 10);

        if (currentQuantity > 1) {
            quantityDisplay.textContent = currentQuantity - 1;
        }
    });

    addToCartButton.addEventListener("click", () => {
        const quantity = parseInt(quantityDisplay.textContent, 10);

        addToCart({
            id: addToCartButton.dataset.id,
            name: addToCartButton.dataset.name,
            price: parseInt(addToCartButton.dataset.price, 10),
            image: addToCartButton.dataset.image,
            qty: quantity
        });

        addToCartMessage.textContent =
            quantity + " item(s) added to cart!";

        setTimeout(() => {
            addToCartMessage.textContent = "";
        }, 2500);
    });
}

/* CART PAGE */

const cartTableBody = document.getElementById("cartTableBody");

if (cartTableBody) {
    let appliedDiscount = 0;

    function updateCartSummary(cart) {
        const subtotal = cart.reduce(
            (total, item) => total + item.price * item.qty,
            0
        );

        const tax = Math.round(subtotal * TAX_RATE);
        const finalTotal = Math.max(
            0,
            subtotal + tax - appliedDiscount
        );

        document.querySelector(".subtotal").textContent =
            formatRupees(subtotal);

        document.querySelector(".tax").textContent =
            formatRupees(tax);

        document.querySelector(".discount").textContent =
            formatRupees(appliedDiscount);

        document.querySelector(".total-amount").textContent =
            formatRupees(finalTotal);

        document.querySelector(".pay-amount").textContent =
            formatRupees(finalTotal);

        const payNowButton = document.querySelector(".pay-now");

        if (payNowButton) {
            if (cart.length === 0) {
                payNowButton.style.pointerEvents = "none";
                payNowButton.style.opacity = "0.5";
            } else {
                payNowButton.style.pointerEvents = "auto";
                payNowButton.style.opacity = "1";
            }
        }
    }

    function renderCart() {
        const cart = getCart();
        const emptyCartMessage = document.getElementById("emptyCartMsg");

        cartTableBody.innerHTML = "";

        emptyCartMessage.style.display =
            cart.length === 0 ? "block" : "none";

        cart.forEach(item => {
            const row = document.createElement("tr");

            row.innerHTML = `
        <td>${item.name}</td>

        <td>${formatRupees(item.price)}</td>

        <td>
          <div class="cart-quantity">
            <button type="button" class="quantity-minus">−</button>
            <span>${item.qty}</span>
            <button type="button" class="quantity-plus">+</button>
          </div>
        </td>

        <td>${formatRupees(item.price * item.qty)}</td>

        <td>
          <button
            type="button"
            class="remove-btn"
            aria-label="Remove item">
            ×
          </button>
        </td>
      `;

            row.querySelector(".quantity-plus").addEventListener("click", () => {
                item.qty += 1;
                saveCart(cart);
                renderCart();
            });

            row.querySelector(".quantity-minus").addEventListener("click", () => {
                if (item.qty > 1) {
                    item.qty -= 1;
                    saveCart(cart);
                    renderCart();
                }
            });

            row.querySelector(".remove-btn").addEventListener("click", () => {
                const updatedCart = cart.filter(
                    cartItem => cartItem.id !== item.id
                );

                saveCart(updatedCart);
                renderCart();
            });

            cartTableBody.appendChild(row);
        });

        updateCartSummary(cart);
    }

    const couponInput = document.querySelector(".coupon-input");
    const couponButton = document.querySelector(".coupon-button");

    couponButton.addEventListener("click", () => {
        const couponCode = couponInput.value.trim().toUpperCase();

        if (couponCode === "") {
            alert("Please enter a coupon code.");
            return;
        }

        if (COUPONS[couponCode]) {
            appliedDiscount = COUPONS[couponCode];

            alert(
                "Coupon applied! " +
                formatRupees(appliedDiscount) +
                " discount added."
            );
        } else {
            appliedDiscount = 0;
            alert("Invalid coupon code.");
        }

        renderCart();
    });

    renderCart();
}

/* PAYMENT PAGE */

const paymentForm = document.querySelector(".payment-form");

if (paymentForm) {
    const orderProductList =
        document.getElementById("orderProductList");

    const cart = getCart();

    function renderOrderSummary() {
        const subtotal = cart.reduce(
            (total, item) => total + item.price * item.qty,
            0
        );

        orderProductList.innerHTML = "";

        if (cart.length === 0) {
            orderProductList.innerHTML = `
        <p class="empty-cart-msg">
          Your cart is empty.
          <a href="product.html">Go shopping →</a>
        </p>
      `;
        }

        cart.forEach(item => {
            const orderProduct = document.createElement("div");

            orderProduct.classList.add("order-product");

            orderProduct.innerHTML = `
        <img src="${item.image}" alt="${item.name}">

        <div>
          <h3>${item.name}</h3>
          <p>Quantity: ${item.qty}</p>
          <strong>
            ${formatRupees(item.price * item.qty)}
          </strong>
        </div>
      `;

            orderProductList.appendChild(orderProduct);
        });

        document.querySelector(".payment-subtotal").textContent =
            formatRupees(subtotal);

        document.querySelector(".payment-total").textContent =
            formatRupees(subtotal);

        document.querySelector(".payment-pay-amount").textContent =
            formatRupees(subtotal);
    }

    renderOrderSummary();

    const paymentOptions =
        document.querySelectorAll(".payment-option");

    paymentOptions.forEach(option => {
        option.addEventListener("click", () => {
            paymentOptions.forEach(item => {
                item.classList.remove("active");
            });

            option.classList.add("active");
        });
    });

    paymentForm.addEventListener("submit", event => {
        event.preventDefault();

        if (cart.length === 0) {
            alert(
                "Your cart is empty. Please add a product before payment."
            );
            return;
        }

        const cardName =
            document.querySelector("#card-name").value.trim();

        const email =
            document.querySelector("#email").value.trim();

        const cardNumber =
            document
                .querySelector("#card-number")
                .value
                .trim()
                .replace(/\s/g, "");

        const expiry =
            document.querySelector("#expiry").value.trim();

        const cvv =
            document.querySelector("#cvv").value.trim();

        if (cardName === "") {
            alert("Please enter the card holder name.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!/^\d{16}$/.test(cardNumber)) {
            alert("Card number must contain 16 digits.");
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            alert("Please enter expiry date in MM/YY format.");
            return;
        }

        if (!/^\d{3}$/.test(cvv)) {
            alert("CVV must contain 3 digits.");
            return;
        }

        localStorage.removeItem(CART_KEY);

        document.getElementById("paymentFormWrapper").style.display =
            "none";

        document.getElementById("paymentSuccess").style.display =
            "block";
    });
}