## Description

**Project Name:** Limechain API

**Description:** Limechain API is a backend API built using NestJS, a Node.js framework, to manage transactions and user data. The API provides a set of endpoints to perform CRUD (Create, Read, Update, Delete) operations on transactions and users.

**Features:**

* User authentication and authorization using JSON Web Tokens (JWT)
* Transaction management: create, read, update, and delete transactions
* User management: create, read, update, and delete users
* Transaction filtering and sorting by user ID
* Error handling and logging

**Technologies:**

* NestJS (Node.js framework)
* TypeORM (Object-Relational Mapping library)
* PostgreSQL (database management system)
* JSON Web Tokens (JWT) for authentication and authorization

**Goals:**

* Provide a secure and scalable API for managing transactions and user data
* Implement authentication and authorization using JWT
* Develop a robust and maintainable codebase using NestJS and TypeORM

**Target Audience:**

* Developers who need to integrate the Limechain API into their applications
* Users who need to manage transactions and user data through the API

**Assumptions:**

* The API will be deployed on a cloud platform (e.g. AWS, Google Cloud)
* The database will be managed using PostgreSQL
* The API will be accessed through HTTPS protocol

**Prerequisites:**
* Create .env file and fill in the needed values for local dev
* Make sure you have postgree sql DB running

## Environment Variables

The application uses the following environment variables, defined in a `.env` file:

| Variable         | Description                                         | Example                                                |
|-------------------|-----------------------------------------------------|--------------------------------------------------------|
| `API_PORT`       | The port the API will run on                        | `3000`                                                 |
| `ETH_NODE_URL`   | The Ethereum node URL for blockchain interactions   | `https://mainnet.infura.io/v3/<your-infura-project-id>`|
| `DB_CONNECTION_URL` | The PostgreSQL connection string                   | `postgres://postgres:admin@localhost:5432/postgres`    |
| `JWT_SECRET`     | The secret key for JWT signing                      | `lime_secret`                                          |

## Docker Deployment
If deploying with Docker, build and start the container:

* docker-compose up --build

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

