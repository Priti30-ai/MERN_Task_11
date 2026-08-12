/* CART FUNCTIONALITY */

const cartItems = document.querySelectorAll(".cart-item");

if (cartItems.length > 0) {

    const taxRate = 0.05;
    let discount = 0;

    function updateCart() {

        let subtotal = 0;

        cartItems.forEach(function (item) {

            const quantityElement =
                item.querySelector(".cart-quantity span");

            const priceElement =
                item.querySelector(".item-price");

            const totalElement =
                item.querySelector(".item-total");

            if (!quantityElement || !priceElement || !totalElement) {
                return;
            }

            const quantity =
                parseInt(quantityElement.textContent);

            const price =
                parseInt(
                    priceElement.textContent
                        .replace("₹", "")
                        .replace(",", "")
                );

            const itemTotal = quantity * price;

            totalElement.textContent =
                "₹" + itemTotal.toLocaleString("en-IN");

            subtotal += itemTotal;
        });


        /* Tax */

        const tax = Math.round(subtotal * taxRate);


        /* Final Total */

        const finalTotal =
            Math.max(0, subtotal + tax - discount);


        /* Update Summary */

        const subtotalElement =
            document.querySelector(".subtotal");

        const taxElement =
            document.querySelector(".tax");

        const discountElement =
            document.querySelector(".discount");

        const totalElement =
            document.querySelector(".total-amount");

        const payAmount =
            document.querySelector(".pay-amount");


        if (subtotalElement) {

            subtotalElement.textContent =
                "₹" + subtotal.toLocaleString("en-IN");
        }


        if (taxElement) {

            taxElement.textContent =
                "₹" + tax.toLocaleString("en-IN");
        }


        if (discountElement) {

            discountElement.textContent =
                "₹" + discount.toLocaleString("en-IN");
        }


        if (totalElement) {

            totalElement.textContent =
                "₹" + finalTotal.toLocaleString("en-IN");
        }


        if (payAmount) {

            payAmount.textContent =
                "₹" + finalTotal.toLocaleString("en-IN");
        }
    }


    /* QUANTITY BUTTONS */

    cartItems.forEach(function (item) {

        const minusButton =
            item.querySelector(".quantity-minus");

        const plusButton =
            item.querySelector(".quantity-plus");

        const quantityElement =
            item.querySelector(".quantity");


        /* Increase Quantity */

        if (plusButton) {

            plusButton.addEventListener("click", function () {

                let quantity =
                    parseInt(quantityElement.textContent);

                quantity++;

                quantityElement.textContent = quantity;

                updateCart();
            });
        }


        /* Decrease Quantity */

        if (minusButton) {

            minusButton.addEventListener("click", function () {

                let quantity =
                    parseInt(quantityElement.textContent);

                if (quantity > 1) {

                    quantity--;

                    quantityElement.textContent = quantity;

                    updateCart();
                }
            });
        }


        /* Remove Product */

        const removeButton =
            item.querySelector(".remove-btn");

        if (removeButton) {

            removeButton.addEventListener("click", function () {

                item.remove();

                updateCart();
            });
        }

    });


    /* COUPON */

    const couponInput =
        document.querySelector(".coupon-input");

    const couponButton =
        document.querySelector(".coupon-button");


    if (couponButton) {

        couponButton.addEventListener("click", function () {

            const coupon =
                couponInput.value.trim().toUpperCase();


            if (coupon === "THALA7") {

                discount = 500;

                alert(
                    "Coupon applied! ₹500 discount added."
                );

                updateCart();

            } else if (coupon === "") {

                alert(
                    "Please enter a coupon code."
                );

            } else {

                discount = 0;

                alert(
                    "Invalid coupon code."
                );

                updateCart();
            }

        });
    }


    /* First Calculation */

    updateCart();
}


/* PAYMENT PAGE */

const paymentForm =
    document.querySelector(".payment-form");

if (paymentForm) {

    paymentForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.querySelector("#card-name").value.trim();

        const email =
            document.querySelector("#email").value.trim();

        const cardNumber =
            document.querySelector("#card-number").value.trim();

        const expiry =
            document.querySelector("#expiry").value.trim();

        const cvv =
            document.querySelector("#cvv").value.trim();


        /* Name Validation */

        if (name === "") {

            alert("Please enter the card holder name.");

            return;
        }


        /* Email Validation */

        if (email === "") {

            alert("Please enter your email.");

            return;
        }


        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            alert("Please enter a valid email address.");

            return;
        }


        /* Card Number Validation */

        if (cardNumber === "") {

            alert("Please enter your card number.");

            return;
        }


        const cardDigits =
            cardNumber.replace(/\s/g, "");


        if (!/^\d{16}$/.test(cardDigits)) {

            alert(
                "Card number must contain 16 digits."
            );

            return;
        }


        /* Expiry Validation */

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {

            alert(
                "Please enter expiry date in MM/YY format."
            );

            return;
        }


        /* CVV Validation */

        if (!/^\d{3}$/.test(cvv)) {

            alert(
                "CVV must contain 3 digits."
            );

            return;
        }


        /* Successful Payment */

        alert(
            "Payment successful! Thank you for shopping with Thala-7."
        );


        paymentForm.reset();

    });
}