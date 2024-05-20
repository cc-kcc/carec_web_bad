import express from "express";
import dotenv from "dotenv";
import expressSession from "express-session";
import { error } from "console";
import grant from "grant";
import { runKnex } from "./utils/db";
export const knex = runKnex()
import { authRouter } from "./router/authRouter";
import { memoRouter } from "./router/memoRouter";


declare module "express-session" {
  interface SessionData {
    userId: number;
    username: string;
    grant: any
  }
}

dotenv.config();

const app = express();
const PORT = 8080;

if (!process.env.SECRET) {
  throw error("SECRET missing in .env!!!");
}
app.use(
  expressSession({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

const grantExpress = grant.express({
  defaults: {
    origin: "http://localhost:8080",
    transport: "session",
    state: true,
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    scope: ["profile", "email"],
    callback: "/auth/login/google",
  },
});

app.use(grantExpress as express.RequestHandler);



// parsing middleware
app.use(express.urlencoded());
app.use(express.json());

// API
app.use("/auth", authRouter);
app.use("/memo", memoRouter);

// static assets
app.use(express.static("public"));
app.use(express.static("uploads"));

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
