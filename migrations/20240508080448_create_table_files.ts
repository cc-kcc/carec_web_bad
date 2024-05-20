import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("files", (table) => {
        table.increments("id").primary();
        table.string("name")
        table.text("content")
        table.boolean("is_file")
        table.integer("category_id")
        table.integer("user_id")
        table.foreign("user_id").references("users.id")
        table.foreign("category_id").references("categories.id")
    })
}


export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTableIfExists("files");
}

