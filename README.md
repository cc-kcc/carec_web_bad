yarn init -y
yarn add knex @types/knex pg
yarn add -D @types/pg
yarn add dotenv @types/dotenv
 yarn add xlsx 
yarn knex init -x ts

yarn add --dev jest
yarn add --dev typescript ts-jest @types/jest @types/node ts-node ts-node-dev
yarn ts-jest config:init


<!-- import dotenv from "dotenv";
dotenv.config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  staging: {
    //...
  },

  production: {
    //...
  },
}; -->