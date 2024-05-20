import AuthService from "./authService";
import Knex from "knex";

const knexConfig = require("../knexfile");
const testConfig = knexConfig["test"];
const knex = Knex(testConfig);

describe("Testing AuthService", () => {
  let authService: AuthService;
  beforeEach(async () => {
    authService = new AuthService(knex);
  });

  it("should not find by email", async () => {

      await expect(() => authService.findByEmail("james@tecky.io")).rejects.toThrow()
  })

  it("find by username, undefined", async () => {

      await expect(authService.findByUsername("james@tecky.io")).resolves.toEqual(undefined)
  })

  it("find by username, valid", async () => {

      await expect(authService.findByUsername("admin")).resolves.toMatchObject({
          username: "admin",
          password: "admin",
          id: 1
      })
  })

  it("valid create a account", async () => {
    await authService.createAccount("james55456", "123");
    await expect(authService.findByUsername("james55456")).resolves.toMatchObject({
        username: "james55456",
        password: "123",
        id: 5
    })
  });
  afterEach(async () => {
    await knex.table("users").where("username", "james55456").del();
    await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 5");
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
