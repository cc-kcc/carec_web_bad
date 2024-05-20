import { Router, Request, Response } from "express";
import { pgClient } from "../pgClient";
import { UserQueryType } from "../utils/types";
import { checkPassword, hashPassword } from "../utils/hash";
import AuthController from "../controllers/authController";
import AuthService from "../services/authService";
import { knex } from "../app";

const authService = new AuthService(knex)
const authController = new AuthController(authService)

export const authRouter = Router();

authRouter.get("/login/google", google); // localhost:8080/auth/register, HTTP Method: POST

authRouter.post("/register", authController.register); // localhost:8080/auth/register, HTTP Method: POST

authRouter.post("/login", authController.login);

authRouter.get("/logout", logout);

authRouter.get("/username", getUsername);

async function google(req: Request, res: Response) {
  try {
    const accessToken: string = req.session?.['grant'].response.access_token;
    const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{
      method:"get",
      headers:{
          "Authorization":`Bearer ${accessToken}`
      }
  });
  const result: any = await fetchRes.json();
  const email = result.email
  const name = result.name

  console.log(result)


  const users = (await pgClient.query(`SELECT * FROM users WHERE users.email = $1`, [email])).rows;
  let user = users[0]
  console.log(user)

  if (!user) {
    // Register
    const insertResult = await pgClient.query(
      "inserT inTo users (username, email, password) Values ($1, $2, $3) returning id",
      [name, email, null]
    );
    // Get User Info from own database after register
    user = await pgClient.query("select * from users where email = $1", [email])
  }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.save();


    return res.redirect('/')
  } catch (e) {
    res.status(400).json({ message: e });
  }
}


async function logout(req: Request, res: Response) {
  if (req.session.username) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Server Internal Error" });
      }

      res.status(200).json({ message: "Logout success" });
    });
  } else {
    res.status(400).json({ message: "You are not logged in." });
  }
}

async function getUsername(req: Request, res: Response) {
  if (req.session.username) {
    res.json({ data: { username: req.session.username } });
  } else {
    res.status(400).json({ message: "You are not logged in." });
  }
}
