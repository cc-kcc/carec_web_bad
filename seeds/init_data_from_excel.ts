import knex, { Knex } from "knex";
import path from "path";
import * as xlsx from "xlsx";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries

  const trx = await knex.transaction();

  try {
    await trx.table("files").del();
    await trx.table("categories").del();
    await trx.table("users").del();

    await trx.raw("ALTER SEQUENCE files_id_seq RESTART WITH 1");
    await trx.raw("ALTER SEQUENCE categories_id_seq RESTART WITH 1");
    await trx.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");

    const file = xlsx.readFile(path.join(__dirname, `../data/data.xlsx`));
    const sheets = file.SheetNames;
    const orders: number[] = [0, 2, 1];
    for (let i of orders) {
      let sheetName = sheets[i];
      const temp: any[] = xlsx.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]]
      );
      let sheetData: any[] = [];

      if (sheetName === "user") {
        for (const { username, password, level } of temp) {
          sheetData.push({ username, password, level });
        }
        await trx.table("users").insert(sheetData);
      } else if (sheetName === "category") {
        for (const { name } of temp) {
          sheetData.push({ name });
        }
        await trx.table("categories").insert(sheetData);
      } else if (sheetName === "file") {
        const userData: { id: number; username: string }[] = await knex(
          "users"
        ).select("id", "username");

        const categoryData: { id: number; name: string }[] = await knex(
          "categories"
        ).select("id", "name");

        // console.log(userData);
        for (const { name, content, is_file, category, owner } of temp) {
          const user_id = userData.find(
            (value) => value.username === owner
          )?.id;
          const category_id = categoryData.find(
            (value) => value.name === category
          )?.id;
          sheetData.push({
            name,
            content,
            is_file,
            category_id,
            user_id,
          });
        }
        await trx.table("files").insert(sheetData);
      }
    }
    await trx.commit();
  } catch (e) {
    console.log(e);
    trx.rollback();
  }
}
