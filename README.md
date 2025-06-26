# Cryptocurrency Tracker

This project is a cryptocurrency tracker application built using Vue.js for the frontend, Node.js with Express.js for the backend, and MongoDB as the database. It integrates the CoinGecko API to provide real-time cryptocurrency data.

## Features

- Real-time cryptocurrency prices and market data
- Search functionality for specific cryptocurrencies
- Detailed views for individual cryptocurrencies
- User portfolio management to track holdings
- Responsive design for a seamless user experience

## Project Structure

```
crypto-tracker
├── client                # Frontend application
│   ├── src               # Source files for Vue.js
│   ├── public            # Public assets
│   ├── package.json      # Client dependencies and scripts
│   └── .env              # Environment variables for client
└── server                # Backend application
    ├── src               # Source files for Node.js
    ├── package.json      # Server dependencies and scripts
    └── .env              # Environment variables for server
```

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd crypto-tracker
   ```

2. Install dependencies for the client:

   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:

   ```
   cd ../server
   npm install
   ```

### Configuration

1. Create a `.env` file in the `client` and `server` directories based on the provided `.env.example` files.
2. Set the necessary environment variables, including API URLs and database connection strings.

### Running the Application

1. Start the backend server:

   ```
   cd server
   npm start
   ```

2. Start the frontend application:

   ```
   cd ../client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.