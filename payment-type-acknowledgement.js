document.addEventListener("DOMContentLoaded", () => {
    // Extract the shop name from the <title> tag
    const shopName = document.title || "your shop";

    // Insert acknowledgment HTML into the DOM
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

    // Locate the target .mt-3 element containing the "Continue" button
    const targetElement = Array.from(document.querySelectorAll(".mt-3")).find(div => 
      div.querySelector('input[type="submit"][value="Continue"].btn.secondary')
    );

    console.log("Target element:", targetElement);

    if (targetElement) {
        targetElement.insertAdjacentHTML("beforebegin", acknowledgmentHTML);
        console.log("Acknowledgment HTML inserted.");
    } else {
        console.error("Target element not found. Acknowledgment HTML not inserted.");
    }

    // Object containing references to acknowledgment wrapper elements
    const acknowledgmentWrappers = {
      credit_card: document.querySelector(".credit-card-acknowledgement-wrapper"),
      custom: document.querySelector(".custom-payment-acknowledgement-wrapper"),
      ach: document.querySelector(".ach-payment-acknowledgement-wrapper"),
    };

    console.log("Acknowledgment wrappers:", acknowledgmentWrappers);

    // Object containing references to acknowledgment input checkboxes
    const acknowledgmentInputs = {
      credit_card: document.querySelector(".credit-card-payment-acknowledgement"),
      custom: document.querySelector(".custom-payment-acknowledgement"),
      ach: document.querySelector(".ach-payment-acknowledgement"),
    };

    // Object containing references to payment option radio buttons
    const paymentOptions = {
      credit_card: document.querySelector('[data-method="credit_card"]'),
      custom: document.querySelector('[data-method="custom"]'),
      ach: document.querySelector('[data-method="ach"]'),
      no_payment: document.querySelector('[data-method="no_payment"]'),
    };

    // Reference to the "Continue" button
    const payment_continue_btn = document.querySelector(".billing-method-container [value='Continue']") ||
                                 document.querySelector(".payment [value='Continue']");

    // Helper function to hide all acknowledgment sections
    const hideAllAcknowledgments = () => {
      Object.values(acknowledgmentWrappers).forEach(wrapper => {
        if (wrapper) wrapper.style.display = "none"; // Hide each acknowledgment wrapper
      });
    };

    // Helper function to clear all acknowledgment checkboxes
    const clearAcknowledgments = () => {
      payment_continue_btn.setAttribute("disabled", true); // Disable the "Continue" button
      Object.values(acknowledgmentInputs).forEach(input => {
        if (input) input.checked = false; // Uncheck all acknowledgment checkboxes
      });
    };

    // Show acknowledgment for the selected payment option
    const showAcknowledgmentForSelectedOption = () => {
      hideAllAcknowledgments(); // Hide all acknowledgment sections first

      if (paymentOptions.no_payment?.checked) {
        return; // If "No Payment Required" is selected, no acknowledgment is needed
      }

      // Display the acknowledgment section corresponding to the selected payment option
      for (const [key, option] of Object.entries(paymentOptions)) {
        if (option?.checked && acknowledgmentWrappers[key]) {
          acknowledgmentWrappers[key].style.display = "block"; // Show the relevant acknowledgment wrapper
        }
      }
    };

    // Check acknowledgment and enable/disable the "Continue" button
    const checkAcknowledgment = () => {
      // Check if any acknowledgment checkbox is selected
      const isAcknowledged = Object.values(acknowledgmentInputs).some(input => input?.checked);
      if (isAcknowledged) {
        payment_continue_btn.removeAttribute("disabled"); // Enable the "Continue" button
      } else {
        payment_continue_btn.setAttribute("disabled", true); // Disable the "Continue" button
      }
    };

    // Handle payment option change
    const onPaymentOptionChange = () => {
      clearAcknowledgments(); // Clear all acknowledgment checkboxes
      showAcknowledgmentForSelectedOption(); // Show the acknowledgment section for the selected option
      checkAcknowledgment(); // Check if acknowledgment is valid
      console.log("Selected payment option:", Object.entries(paymentOptions).find(([key, option]) => option?.checked));
    };

    // Add event listeners to payment options
    paymentOptions.credit_card?.addEventListener("click", onPaymentOptionChange);
    paymentOptions.custom?.addEventListener("click", onPaymentOptionChange);
    paymentOptions.ach?.addEventListener("click", onPaymentOptionChange);
    paymentOptions.no_payment?.addEventListener("click", onPaymentOptionChange);

    // Add event listeners to acknowledgment checkboxes
    Object.values(acknowledgmentInputs).forEach(input => {
      input?.addEventListener("click", checkAcknowledgment); // Check acknowledgment when a checkbox is clicked
    });

    console.log("Event listeners attached to payment options and checkboxes.");

    // Initialize on page load
    hideAllAcknowledgments(); // Hide all acknowledgment sections initially
    showAcknowledgmentForSelectedOption(); // Show acknowledgment for the selected payment option
    checkAcknowledgment(); // Check if acknowledgment is valid
    console.log("Acknowledgment wrappers visibility:", acknowledgmentWrappers);
});


