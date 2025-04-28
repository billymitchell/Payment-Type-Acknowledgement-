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
        const targetElement = querySelectorAll(".mt-3").find(div =>
            div.querySelector(selectors.targetElement)
        );
        if (targetElement) {
            targetElement.insertAdjacentHTML("beforebegin", acknowledgmentHTML);
        } else {
            console.error("Target element not found. Acknowledgment HTML not inserted.");
        }
    };

    const hideAllAcknowledgments = () => {
        Object.values(selectors.acknowledgmentWrappers).forEach(selector => {
            const wrapper = querySelector(selector);
            if (wrapper) wrapper.style.display = "none";
        });
    };

    const clearAcknowledgments = (continueBtn) => {
        continueBtn.setAttribute("disabled", true);
        Object.values(selectors.acknowledgmentInputs).forEach(selector => {
            const input = querySelector(selector);
            if (input) input.checked = false;
        });
    };

    const showAcknowledgmentForSelectedOption = (paymentOptions, acknowledgmentWrappers) => {
        hideAllAcknowledgments();
        if (querySelector(selectors.paymentOptions.no_payment)?.checked) return;

        for (const [key, selector] of Object.entries(paymentOptions)) {
            if (querySelector(selector)?.checked) {
                const wrapper = querySelector(acknowledgmentWrappers[key]);
                if (wrapper) wrapper.style.display = "block";
            }
        }
    };

    const checkAcknowledgment = (continueBtn) => {
        const isAcknowledged = Object.values(selectors.acknowledgmentInputs).some(selector => {
            const input = querySelector(selector);
            return input?.checked;
        });
        if (isAcknowledged) {
            continueBtn.removeAttribute("disabled");
        } else {
            continueBtn.setAttribute("disabled", true);
        }
    };

    const attachEventListeners = (paymentOptions, acknowledgmentInputs, continueBtn) => {
        const onPaymentOptionChange = () => {
            clearAcknowledgments(continueBtn);
            showAcknowledgmentForSelectedOption(paymentOptions, selectors.acknowledgmentWrappers);
            checkAcknowledgment(continueBtn);
        };

        Object.values(paymentOptions).forEach(selector => {
            querySelector(selector)?.addEventListener("click", onPaymentOptionChange);
        });

        Object.values(acknowledgmentInputs).forEach(selector => {
            querySelector(selector)?.addEventListener("click", () => checkAcknowledgment(continueBtn));
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
    };

    // Initialize
    insertAcknowledgmentHTML();
    const continueBtn = querySelector(selectors.paymentContinueBtn);
    attachEventListeners(selectors.paymentOptions, selectors.acknowledgmentInputs, continueBtn);
    hideAllAcknowledgments();
    showAcknowledgmentForSelectedOption(selectors.paymentOptions, selectors.acknowledgmentWrappers);
    checkAcknowledgment(continueBtn);
});


