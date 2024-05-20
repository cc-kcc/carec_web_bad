import { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/hash";
import AuthService from "../services/authService";
import { UserQueryType } from "../utils/types";
import { pgClient } from "../pgClient";

export default class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    let { email, username, password } = req.body;
    // { email: "", username: "", password:"" }
    let hashedPassword = await hashPassword(password);
    try {
      let userQueryResult: UserQueryType | undefined =
        await this.authService.findByEmail(email);
      //   async () => undefined

      //   email exists
      if (userQueryResult) {
        res.status(400).json({ message: "Duplicate entry." });
        return;
      }
      //   console.log({userQueryResult});

      const insertResult = await this.authService.createAccount(
        username,
        hashedPassword
      );
      const returningId = insertResult[0].id;
      //   console.log({returningId});
      //   console.log(res.status);

      res.status(200).json({
        msg: "register successful",
        userId: returningId,
      });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };

  login = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    let userQueryResult: UserQueryType | undefined =
        await this.authService.findByEmail(email);

        console.log(userQueryResult)
    //   email exists
    if (userQueryResult) {
      let truePassword = userQueryResult.password;

      // const isMatched = password == truePassword
      const isMatched = await checkPassword({
        plainPassword: password,
        hashedPassword: truePassword,
      });

      // password matched
      if (isMatched) {
        req.session.userId = userQueryResult.id;
        req.session.username = userQueryResult.username;

        req.session.save();

        res.status(200).json({
          message: "login success",
          data: { username: userQueryResult.username },
        });
      } else {
        console.log("wrong password");

        res.status(400).json({ message: "wrong password" });
      }
    } else {
      console.log("wrong email");
      res.status(400).json({ message: "Login Failed" });
    }
  };
}
