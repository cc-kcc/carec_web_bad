import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username").notNullable();
        table.string("password")
        table.string("level")
    })
}


export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTableIfExists("users");
}

