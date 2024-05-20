import Knex from "knex";
import dotenv from "dotenv";
dotenv.config()

export function runKnex() {
    const knexConfigs = require("../knexfile");
    const configMode = process.env.NODE_ENV || "development";
    const knexConfig = knexConfigs[configMode];
    const knex = Knex(knexConfig);
    return knex
}
runKnex()