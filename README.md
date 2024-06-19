# Banking Management System

## Project Overview

The Banking Management System is a robust and scalable backend application designed to handle the core operations of a banking institution. This system provides functionalities for managing customer accounts, processing transactions, handling loans, and generating financial reports. Built using Node.js and Express, it leverages modern web development practices to ensure efficiency, security, and ease of use.

## Features

- **Customer Management**: Create, update, and manage customer profiles and their associated bank accounts.
- **Account Management**: Support for different types of accounts such as savings, checking, and fixed deposits.
- **Transaction Processing**: Handle deposits, withdrawals, transfers, and payments with secure transaction logging.
- **Loan Management**: Manage loan applications, approvals, repayments, and interest calculations.
- **Authentication and Authorization**: Secure login and role-based access control to ensure data privacy and security.
- **Financial Reporting**: Generate detailed financial reports, including account statements and transaction histories.
- **Error Handling and Logging**: Comprehensive error handling and logging mechanisms to ensure system reliability and maintainability.
- **Environment Configurations**: Configuration of sensitive data through environment variables for enhanced security.
- **Future Enhancements**: Upcoming features include online payment routes and additional functionalities to enhance the banking experience.

## Technologies Used

- **bcrypt** and **bcryptjs**: Hashing libraries for securely storing passwords.
- **cloudinary**: Cloud-based service for managing and serving images and other media files.
- **cookie-parser**: Middleware for parsing cookies attached to the client request object.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.js.
- **dotenv**: Module for loading environment variables from a `.env` file into `process.env`.
- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **jsonwebtoken**: Implementation of JSON Web Tokens (JWT) for secure authentication between parties.
- **mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment.
- **multer**: Middleware for handling multipart/form-data, primarily used for uploading files.
- **oracledb**: Official Node.js driver for Oracle Database.

# Installation and Setup

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB instance running locally or remotely.

## 1. Clone the Repository:\*\*

### Steps

```
git clone https://github.com/TechWithChhotu/BankingManagementSystem.git
```

```
 cd BankingManagementSystem
```

```
npm install
```

Create a .env file in the backend directory and add your configuration settings (excluding this file from version control):

```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=your-port


ORACLE_USERNAME=username
ORACLE_PASSWORD=password
ORACLE_CONNECTION_STRING=connection_string


CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=API_Key
CLOUDINARY_API_SECRET=API_Secret
```

run backend server

```
cd backend
```

```
npm start
```

# Contributing

Contributions are welcome! Please fork this repository and submit pull requests for any features, improvements, or bug fixes.

# License

This project is licensed under the MIT License. See the LICENSE file for more details.

# Contact

For any inquiries or issues, please contact [ techwithchhotu2022@gmail.com , chhotustudymail@gmail.com] or visit [https://chhotupatel.netlify.app/]
