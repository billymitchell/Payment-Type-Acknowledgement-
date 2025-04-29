// Constants
const shopName = document.title || "your shop";
const acknowledgmentHTML = `
<div class="payment-type-acknowledgement" style="margin-bottom: 15px;">
    <div class="form-check credit-card-acknowledgement-wrapper" style="display: none;">
        <b>Required Acknowledgement</b>
        <input class="form-check-input credit-card-payment-acknowledgement" type="checkbox"
            name="credit-card-payment-acknowledgement" id="credit-card-payment-acknowledgement" />
        <label class="form-check-label" for="credit-card-payment-acknowledgement">I understand that this payment is
            being made to the EGroup, Inc. on behalf of ${shopName} and will be reflected as such on my credit card
            statement.</label>
    </div>
    <div class="form-check custom-payment-acknowledgement-wrapper" style="display: none;">
        <b>Required Acknowledgement</b>
        <input class="form-check-input custom-payment-acknowledgement" type="checkbox"
            name="custom-payment-acknowledgement" id="custom-payment-acknowledgement" />
        <label class="form-check-label" for="custom-payment-acknowledgement">I understand that payment for this purchase
            order must be made out and submitted to Centricity (or our parent Company, E Group, Inc.).</label>
    </div>
    <div class="form-check ach-payment-acknowledgement-wrapper" style="display: none;">
        <b>Required Acknowledgement</b>
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

// Utility Functions
const querySelector = (selector) => document.querySelector(selector);
const querySelectorAll = (selector) => Array.from(document.querySelectorAll(selector));

const toggleContinueButton = () => {
    const continueBtn = querySelector(selectors.paymentContinueBtn);
    if (!continueBtn) return console.warn("Continue button not found.");

    const allAcknowledgmentsChecked = Object.values(selectors.acknowledgmentInputs).every((selector) => {
        const input = querySelector(selector);
        const wrapper = input?.closest(".form-check");
        return wrapper?.style.display === "block" ? input.checked : true;
    });

    continueBtn.disabled = !allAcknowledgmentsChecked;
    console.log(`Continue button ${allAcknowledgmentsChecked ? "enabled" : "disabled"}.`);
};

const updateAcknowledgmentVisibility = () => {
    let selectedPaymentType = null;

    Object.entries(selectors.paymentOptions).forEach(([key, selector]) => {
        const paymentOption = querySelector(selector);
        const wrapper = querySelector(selectors.acknowledgmentWrappers[key]);
        const input = querySelector(selectors.acknowledgmentInputs[key]);

        if (paymentOption && wrapper) {
            // Check the initial state of the payment option
            if (paymentOption.checked) {
                wrapper.style.display = "block";
                selectedPaymentType = key; // Track the selected payment type
                console.log(`Acknowledgment for '${key}' shown (initial state).`);
            } else {
                if (input) input.checked = false;
                wrapper.style.display = "none";
                console.log(`Acknowledgment for '${key}' hidden (initial state).`);
            }
        }
    });

    // Log the selected payment type
    if (selectedPaymentType) {
        console.log(`Selected payment type: '${selectedPaymentType}'`);
    } else {
        console.log("No payment type is selected.");
    }

    // Log the state of all payment options
    Object.entries(selectors.paymentOptions).forEach(([key, selector]) => {
        const paymentOption = querySelector(selector);
        console.log(`Payment option '${key}':`, paymentOption?.checked);
    });

    // Ensure the continue button reflects the initial state
    toggleContinueButton();
};

const attachListeners = () => {
    // Attach listeners to payment options
    Object.values(selectors.paymentOptions).forEach((selector) => {
        const option = querySelector(selector);
        if (option) option.addEventListener("change", updateAcknowledgmentVisibility);
    });

    // Attach listeners to acknowledgment inputs
    Object.values(selectors.acknowledgmentInputs).forEach((selector) => {
        const input = querySelector(selector);
        if (input) input.addEventListener("change", toggleContinueButton);
    });
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    const initializeAcknowledgmentLogic = () => {
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

            attachListeners();

            // Delay the initial state check to ensure payment options are fully initialized
            setTimeout(() => {
                console.log("Running initial acknowledgment visibility check...");
                updateAcknowledgmentVisibility();
            }, 100); // Adjust the delay as needed
        } catch (error) {
            console.error("Error during acknowledgment logic initialization:", error);
        }
    };

    initializeAcknowledgmentLogic();
});

