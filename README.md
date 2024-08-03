# FinTech Application
Welcome to the FinTech Application! This application provides basic financial services including user authentication (login and registration), depositing funds, withdrawing funds, and transferring funds between accounts.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contact](#contact)

## Features

- **User Authentication**: Register and login functionality to securely access the application.
- **Deposit Funds**: Users can deposit money into their account.
- **Withdraw Funds**: Users can withdraw money from their account.
- **Transfer Funds**: Users can transfer money to other users within the application.
- **Transaction Hostory**: Users can view all previous transaction history.

## Installation

To get started with the FinTech Application, follow these steps in same sequence:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/fintech-app.git
    ```

2. **Set up environment variables**:

     Create a `.env` file in the `/backend` directory and add the necessary environment variables:
     ```bash
     PORT=5873

     JWT_SECRET=78hb887hq3khc216kc92tncs92nx
     SESSION_EXPIRY=15m

     HASURA_URL=https://civil-gobbler-53.hasura.app/v1/graphql
     HASURA_ADMIN_SECRET=vmlBxkMN3J2dW9TONMQ3U5Kw015ttJmQqqK1AvzmwLkzySzXG2T9Gr5mM5A7p1O8
     ```
3. **Configure and Start Backend**:

     ```bash
     cd backend
     npm install
     npm run start
     ```
     Now Backend is up and running at http://localhost:5873, keep the terminal running and start new one in project root folder to setup frontend.
4. **Configure and Start the Application**:

     ```bash
     cd frontend
     npm install
     npm run dev
     ```

     All set!, application is ready to use at http://localhost:3000 or your default NextJS available port.


## API Endpoints

### Authentication

Use {{server}} as `http://localhost:5873`

**Login**
- **Method**: POST
- **URL**: `{{server}}/api/v1/users/login`
- **Request Body**:
  ```json
  {
     "username": "user",
     "password": "password"
  }
  // please create an user before login
  ```

**Logout**
- **Method**: POST
- **URL**: `{{server}}/users/logout`

**User Management**

**Create User**
- **Method**: POST
- **URL**: `{{server}}/users/createUser`
- **Request Body**:
  ```json
  {
     "name": "Sachida",
     "username": "sachid",
     "password": "2134",
     "balance": 1000,
     "address": "h5-iitk"
  }
  ```

**Get User**
- **Method**: GET
- **URL**: `{{server}}/users/getuser`

**Get Transactions**
- **Method**: GET
- **URL**: `{{server}}/users/get_transactions`

**Account Management**

**Deposit**
- **Method**: POST
- **URL**: `{{server}}/users/deposit`
- **Request Body**:
  ```json
  {
     "amount": 2100,
     "password": "221101"
  }
  ```

**Withdraw**
- **Method**: POST
- **URL**: `{{server}}/users/withdraw`
- **Request Body**:
  ```json
  {
     "amount": 1200,
     "password": "221101"
  }
  ```

**Transfer**
- **Method**: POST
- **URL**: `{{server}}/users/transfer`
- **Request Body**:
  ```json
  {
     "amount": 12,
     "to": 12,
     "password": "221101"
  }
  ```

## Technologies Used

## Frontend

### Next.js
- **Description**: Next.js is a React framework that enables server-side rendering and generating static websites for React-based web applications. It offers an optimized developer experience with features like file-based routing, API routes, and built-in CSS and Sass support.
- **Official Documentation**: [Next.js Documentation](https://nextjs.org/docs)

## Backend

### Node.js
- **Description**: Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It is used for building scalable network applications, offering a non-blocking, event-driven architecture.
- **Official Documentation**: [Node.js Documentation](https://nodejs.org/en/docs/)

### Express
- **Description**: Express is a minimal and flexible Node.js web application framework that provides a robust set of features to develop web and mobile applications. It is widely used for building RESTful APIs.
- **Official Documentation**: [Express Documentation](https://expressjs.com/)

### Hasura GraphQL
- **Description**: Hasura is a GraphQL engine that provides instant real-time GraphQL APIs on new or existing Postgres databases. It helps in building GraphQL backends quickly, supporting real-time capabilities out of the box.
- **Official Documentation**: [Hasura Documentation](https://hasura.io/docs/)

## Authentication

### JSON Web Tokens (JWT)
- **Description**: JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It is used for authentication and information exchange.
- **Official Documentation**: [JWT Documentation](https://jwt.io/introduction/)

---

These technologies collectively contribute to building a robust, scalable, and efficient FinTech application, providing an excellent user experience and streamlined development process.


## Contact

If you have any questions, feedback, or inquiries about the FinTech Application, please feel free to reach out to me.

## Support and Feedback

I value your feedback and suggestions. Please let me know how I can improve the application and for support and troubleshooting , you can contact me at:

- **Email**: navik09.me@gmail.com
- **Phone**: +91 6307009843

---

Thank you for trying this simple FinTech Application. I look forward to assisting you!
