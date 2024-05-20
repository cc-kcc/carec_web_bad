import { UserQueryType } from "../utils/types";
import type { Knex } from "knex";

export default class AuthService {
  // constructor(private pgClient: Client) {}
  constructor(private knex: Knex) {
  }

  async findByEmail(email: string): Promise<UserQueryType | undefined> {
    const result = await this.knex
      .table("users")
      .select("username", "password", "id")
      .where("email", email);
    return result[0];
  }

  async findByUsername(username: string): Promise<UserQueryType | undefined> {
    const result = await this.knex
      .table("users")
      .select("username", "password", "id")
      .where("username", username);
    return result[0];
  }

  async createAccount(
    username: string,
    hashedPassword: string
  ) {
    // const sql = this.knex.table("users").insert({
    //   username,
    //   password: hashedPassword
    // }).returning("id").toSQL().sql

    // console.log(sql)


    const result = await this.knex.table("users").insert({
      username,
      password: hashedPassword
    }).returning("id")
    return result;
  }
}
