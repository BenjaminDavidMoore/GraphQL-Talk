# GraphQL Demo
Hello and welcome to the GraphQL Demo project! This project is a Express.js / Apollo Server example for a GraphQL server for a hypotheical DMV. The goal of this project it to keep things as simple as possible (no TS, no fancy frameworks etc) so that you're able to see the cool features of GraphQL and understand a little more about how they work.

Topics this repo covers:
  - Basic Schema / Resolver Setup for Queries & Mutations
  - Secondary Resolvers
  - Data Loader
  - Authentication
  - Authorization (Via Schema Directives)
  - A RESTful /health endpoint to show you can run both REST and GraphQL in the same server

# Setup
Be sure you have docker set up on your computer. If you don't you can do so [here](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)

You'll also probably want a DB client that can connect to a PostgreSQL database. If you're on a mac I highly recommend Postico, but if you're not, TablePlus is a good freemium alternative

It goes without saying but you'll want Node on your computer as well since this is a Node project

## Steps
Clone the repo
```bash
git clone https://github.com/BenjaminDavidMoore/GraphQL-Talk.git
```
Install dependencies
```bash
yarn
```

Start your database
```bash
docker-compose up
```

Once that finishes, try and connect to your database with your DB client. Below are the connection details (These are the default values. If you configured them in the config.js file, use those values instead)
```
host: 127.0.0.1
port: 5432
username: postgres
password: <none>
database: postgres
```

Run the migrations to create the database schema
```bash
yarn migrate:up
```

Seed the database with some test data:
```bash
yarn seed:run
```

Start the server
```bash
yarn start
```

# Use
Once you start the server, it is now running on localhost:4000

You can navigate in your browser to our one RESTful endpoint localhost:4000/health if you want to see that working

However, the good stuff is located in the Apollo side of the server under locahost:4000/graphql

Below are some queries you can use to try out some of the features:

Getting some basic data
```graphql
query GetAllUsers {
  users {
    id
    name
    role
  }
}

query GetSingleUser {
  user(id: "32bb9e61-a146-5e36-b537-f407669d2e0f") {
    id
    name
    role
  }
}
```

Getting nested data:
```graphql
query GetVehiclesWithDrivers {
  vehicles {
    id
    name
    drivers {
      id
      name
    }
  }
}
```

Getting a session "token".

`Note`: This is a demo app and we kept things simple to focus on GraphQL, not authentication. Please don't do auth the way that we do here in your actual application. It's terrible.
```graphql
mutation AdminLogin {
  login(input: { name: "Robert Hodges" }) {
     id
     userId
  }
}

mutation NonAdminLogin {
  login(input: { name: "Isaiah Osborne" }) {
     id
     userId
  }
}
```

Doing things with variables
```graphql
mutation CreateDriver ($CreateDriverInput: CreateDriverInput!){
  createDriver(input: $CreateDriverInput) {
    id
    name
  }
}

# Variables
# {
#   "CreateDriverInput":{
#     "name": "Ricky Bobby",
#     "address": "1 Fast Lane",
#     "zip": 123456
#   }
# }
```

Doing things that require authorization
```graphql
mutation DeleteDriver {
  deleteDriver(input: { id: "a17ca3cd-a989-4d5c-853a-bfc216e264ca" })
}

# Headers
# {
#   "Authorization": "d2de4723-3684-4da7-ab63-b1ac9cfb7d4e"
# }
```
