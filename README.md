# Event Categories Management API

This project is a backend application built with NestJS, PostgreSQL (running in Docker), and TypeORM. The sections below provides step-by-step guides for setting it up, including running PostgreSQL in Docker, setting up the environment variables.

## Prerequisites

Ensure the following are installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (preferably LTS version)

## Project Setup

### 1. Clone the Repository

Clone the project repository:

```bash
git clone https://github.com/simplecodez/category-management.git
cd category-management

```

### 2. Install npm packages

```bash
npm install
```

### 3. Add the Environment variables

Create a file named `.env` at the root of your project and populate this envs

```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
```

### 4. Run Postgres on docker

The command below sets up the Postgres image container and creates the DB as defined.

```bash
docker-compose up -d
```

### 5. Start App

Running the command below to start the app.

```bash
npm start
```

### 6. View Documentation

To view the API documentation, open your browser and go to:

[`http://localhost:3000/api/v1/docs`](http://localhost:3000/api/v1/docs)

> Documentation is generated using Swagger.
> Also Comments and JsDoc were provided for easy navigation

### 7. Unit Testing

To run unit test, run this command:

```bash
npm run test:cov
```
