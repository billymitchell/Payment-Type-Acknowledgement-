# Payment Type Acknowledgement

## Project Overview
This project is designed to manage and enforce payment type acknowledgements across all stores. It ensures that customers explicitly acknowledge payment terms and conditions before proceeding with their transactions. The solution is scalable, easy to integrate, and provides a seamless user experience.

## Features
- **Acknowledgement Handling**: Supports multiple payment types, including credit card, ACH, and custom payment methods.
- **Dynamic Rendering**: Dynamically displays relevant acknowledgements based on the selected payment method.
- **Validation**: Ensures that acknowledgements are completed before allowing customers to proceed.
- **Customizable**: Easily adaptable to different store requirements.
- **No Render Flash**: Optimized to prevent UI flashes during acknowledgment rendering.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Payment-Type-Acknowledgement
   ```
3. Serve the project or integrate the JavaScript file into your application.

## Usage
1. Include the JavaScript file in your HTML:
   ```html
   <script src="https://billymitchell.github.io/Payment-Type-Acknowledgement-/payment-type-acknowledgement.js" defer></script>
   ```
2. Ensure the `<title>` tag in your HTML contains the shop name, as it will be dynamically extracted by the script.
3. The script will automatically insert the acknowledgment sections and handle user interactions.

## Development
To make changes to the script:
1. Edit the `payment-type-acknowledgement.js` file located in the project directory.
2. Test your changes locally before committing.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.