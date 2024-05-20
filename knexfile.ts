import type { Knex } from "knex";
import dotenv from 'dotenv'
dotenv.config()

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: 5433
    },
  },
  test: {
    client: "postgresql",
    connection: {
      database: process.env.DB_TEST_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: 5433
    },
  },
};

module.exports = config;
