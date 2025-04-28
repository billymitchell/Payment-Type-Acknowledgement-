document.addEventListener("DOMContentLoaded", () => {
    const shopName = document.title || "your shop";

    // Constants for acknowledgment HTML and selectors
    const acknowledgmentHTML = `
    <div class="payment-type-acknowledgement" style="margin-bottom: 15px;">
        <b>Required Acknowledgement</b>
        <div class="form-check credit-card-acknowledgement-wrapper" style="display: none;">
            <input class="form-check-input credit-card-payment-acknowledgement" type="checkbox"
                name="credit-card-payment-acknowledgement" id="credit-card-payment-acknowledgement" />
            <label class="form-check-label" for="credit-card-payment-acknowledgement">I understand that this payment is
                being made to the EGroup, Inc. on behalf of ${shopName} and will be reflected as such on my credit card
                statement.</label>
        </div>
        <div class="form-check custom-payment-acknowledgement-wrapper" style="display: none;">
            <input class="form-check-input custom-payment-acknowledgement" type="checkbox"
                name="custom-payment-acknowledgement" id="custom-payment-acknowledgement" />
            <label class="form-check-label" for="custom-payment-acknowledgement">I understand that payment for this purchase
                order must be made out and submitted to Centricity (or our parent Company, E Group, Inc.).</label>
        </div>
        <div class="form-check ach-payment-acknowledgement-wrapper" style="display: none;">
            <input class="form-check-input ach-payment-acknowledgement" type="checkbox" name="ach-payment-acknowledgement"
                id="ach-payment-acknowledgement" />
            <label class="form-check-label" for="ach-payment-acknowledgement">I understand there is a $25 fee for declined
                ACH payments. Please make sure your account information is accurate.</label>
        </div>
    </div>
    `;

    const selectors = {
        targetElement: ".mt-3 input[type='submit'][value='Continue'].btn.secondary",
        paymentContinueBtn: ".billing-method-container [value='Continue'], .payment [value='Continue']",
        paymentOptions: {
            credit_card: '[data-method="credit_card"]',
            custom: '[data-method="custom"]',
            ach: '[data-method="ach"]',
            no_payment: '[data-method="no_payment"]',
        },
        acknowledgmentWrappers: {
            credit_card: ".credit-card-acknowledgement-wrapper",
            custom: ".custom-payment-acknowledgement-wrapper",
            ach: ".ach-payment-acknowledgement-wrapper",
        },
        acknowledgmentInputs: {
            credit_card: ".credit-card-payment-acknowledgement",
            custom: ".custom-payment-acknowledgement",
            ach: ".ach-payment-acknowledgement",
        },
    };

    // Utility functions
    const querySelector = (selector) => document.querySelector(selector);
    const querySelectorAll = (selector) => Array.from(document.querySelectorAll(selector));

    const insertAcknowledgmentHTML = () => {
        try {
            const targetElement = querySelectorAll(".mt-3").find(div =>
                div.querySelector(selectors.targetElement)
            );
            if (targetElement) {
                targetElement.insertAdjacentHTML("beforebegin", acknowledgmentHTML);
                console.log("Acknowledgment HTML inserted successfully.");
            } else {
                console.error("Target element not found. Acknowledgment HTML not inserted.");
            }
        } catch (error) {
            console.error("Error in insertAcknowledgmentHTML:", error);
        }
    };

    const hideAllAcknowledgments = () => {
        try {
            Object.values(selectors.acknowledgmentWrappers).forEach(selector => {
                const wrapper = querySelector(selector);
                if (wrapper) {
                    wrapper.style.display = "none";
                    console.log(`Acknowledgment wrapper '${selector}' hidden.`);
                } else {
                    console.warn(`Acknowledgment wrapper '${selector}' not found.`);
                }
            });
        } catch (error) {
            console.error("Error in hideAllAcknowledgments:", error);
        }
    };

    const clearAcknowledgments = (continueBtn) => {
        continueBtn.setAttribute("disabled", true);
        Object.values(selectors.acknowledgmentInputs).forEach(selector => {
            const input = querySelector(selector);
            if (input) input.checked = false;
        });
    };

    const showAcknowledgmentForSelectedOption = (paymentOptions, acknowledgmentWrappers) => {
        try {
            hideAllAcknowledgments();

            // Check if "No Payment" is selected
            const noPaymentOption = querySelector(selectors.paymentOptions.no_payment);
            if (noPaymentOption?.checked) {
                console.log("No Payment option selected. No acknowledgment required.");
                return;
            }

            // Iterate through payment options and show the corresponding acknowledgment wrapper
            let acknowledgmentShown = false;
            for (const [key, selector] of Object.entries(paymentOptions)) {
                const paymentOption = querySelector(selector);
                if (paymentOption?.checked) {
                    const wrapper = querySelector(acknowledgmentWrappers[key]);
                    if (wrapper) {
                        wrapper.style.display = "block"; // Show the acknowledgment wrapper
                        acknowledgmentShown = true;
                        console.log(`Acknowledgment wrapper for '${key}' displayed.`);
                    } else {
                        console.error(`Acknowledgment wrapper for '${key}' not found.`);
                    }
                }
            }

            if (!acknowledgmentShown) {
                console.warn("No acknowledgment wrapper was displayed. Check payment options.");
            }
        } catch (error) {
            console.error("Error in showAcknowledgmentForSelectedOption:", error);
        }
    };

    const checkAcknowledgment = (continueBtn) => {
        try {
            const isAcknowledged = Object.values(selectors.acknowledgmentInputs).some(selector => {
                const input = querySelector(selector);
                return input?.checked;
            });
            if (isAcknowledged) {
                continueBtn.removeAttribute("disabled");
                console.log("Acknowledgment completed. Continue button enabled.");
            } else {
                continueBtn.setAttribute("disabled", true);
                console.warn("Acknowledgment not completed. Continue button disabled.");
            }
        } catch (error) {
            console.error("Error in checkAcknowledgment:", error);
        }
    };

    const attachEventListeners = (paymentOptions, acknowledgmentInputs, continueBtn) => {
        try {
            const onPaymentOptionChange = () => {
                try {
                    clearAcknowledgments(continueBtn);
                    showAcknowledgmentForSelectedOption(paymentOptions, selectors.acknowledgmentWrappers);
                    checkAcknowledgment(continueBtn);
                } catch (error) {
                    console.error("Error in onPaymentOptionChange:", error);
                }
            };

            Object.values(paymentOptions).forEach(selector => {
                const paymentOption = querySelector(selector);
                if (paymentOption) {
                    paymentOption.addEventListener("click", onPaymentOptionChange);
                    console.log(`Event listener added for payment option '${selector}'.`);
                } else {
                    console.warn(`Payment option '${selector}' not found.`);
                }
            });

            Object.values(acknowledgmentInputs).forEach(selector => {
                const input = querySelector(selector);
                if (input) {
                    input.addEventListener("click", () => checkAcknowledgment(continueBtn));
                    console.log(`Event listener added for acknowledgment input '${selector}'.`);
                } else {
                    console.warn(`Acknowledgment input '${selector}' not found.`);
                }
            });

            continueBtn?.addEventListener("click", (event) => {
                const isAcknowledged = Object.values(acknowledgmentInputs).some(selector => {
                    const input = querySelector(selector);
                    return input?.checked;
                });
                if (!isAcknowledged) {
                    event.preventDefault();
                    console.error("Acknowledgment not completed. Preventing form submission.");
                }
            });
        } catch (error) {
            console.error("Error in attachEventListeners:", error);
        }
    };

    // Initialize
    try {
        insertAcknowledgmentHTML();
        const continueBtn = querySelector(selectors.paymentContinueBtn);
        showAcknowledgmentForSelectedOption(selectors.paymentOptions, selectors.acknowledgmentWrappers);
        attachEventListeners(selectors.paymentOptions, selectors.acknowledgmentInputs, continueBtn);
        hideAllAcknowledgments();
        checkAcknowledgment(continueBtn);
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});


