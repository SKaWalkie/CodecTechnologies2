# Expense Tracker

Expense Tracker (now **Budget Buddy**) is a lightweight web application built with React for the frontend. It allows users to track their expenses and income conveniently without relying on any external backend service. All data is stored in the browser via `localStorage`, and the interface is styled using Tailwind CSS.

## Features

- **Simple Sign‑In:** Users are prompted for their name to personalize the experience. Authentication is handled entirely in the browser using `localStorage`.
- **Expense Tracking:** Users can add, view, and delete their expenses and income.
- **Persistence:** All transactions and user information are saved to `localStorage`, so your data stays around even after refreshing the page or closing the browser.
- **Responsive Design:** The application is styled with Tailwind CSS and adapts to different screen sizes.

## Technologies Used

- **React:** Frontend library for building the user interface.
- **Tailwind CSS:** Utility‑first CSS framework included via CDN for quick styling.
- **localStorage:** Browser API used to persist user and transaction data locally.

## Getting Started

To run the application locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies by running `npm install`.
4. Run the development server with `npm start`.
5. Open your browser to `http://localhost:3000` to start using Budget Buddy.

No external services are required; the app works entirely offline using your browser's storage.

## Usage

1. Upon launching the app you will be asked to enter your name. This step personalizes your Budget Buddy but does not create any external accounts.
2. After entering your name you can add entries by filling in a description, amount and selecting whether it is an income or an expense.
3. All entries will appear in the Transactions table where you can delete individual items. Your balance, total income and total expenses are updated automatically.

## Deployment

You can host Budget Buddy on any static hosting provider. To generate production files run `npm run build` and copy the contents of the `build/` directory to your hosting platform.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request. Ideas for new features (such as expense categories or data export) are especially appreciated.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
