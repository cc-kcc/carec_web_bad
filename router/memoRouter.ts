import { Router, Request, Response } from "express";
import { pgClient } from "../pgClient";
import formidable from "formidable";
import { isLoggedIn } from "../utils/guard";
import MemoService from "../services/memoService";
import MemoController from "../controllers/memoController";
import { knex } from "../app";

export const memoRouter = Router();

const memoService = new MemoService(pgClient, knex)
const memoController = new MemoController(memoService)

memoRouter.get("/", getAllMemos);
memoRouter.post("/", memoController.createMemo); // localhost:8080/memo
memoRouter.put("/", isLoggedIn, memoController.updateMemoById);
memoRouter.delete("/", isLoggedIn, memoController.deleteMemoById);
memoRouter.put("/like", isLoggedIn, toggleLike);

async function getAllMemos(req: Request, res: Response) {
  //  db query , find all memos.id that the user liked using req.session.userId
  // upon success query, array of memos.id return e.g.[1,3]

  // do another db query, select all memos,
  // upon success query,array of memos data (id,content,image)
  // [{id:1,content:"i love day"},{id:1,content:"i love ivy"}]

  // for loop([1,3])
  // {
  //  for loop([{id:1,content:"i love day"},...,{id:3,content:"i love ivy"}])
  //  {
  //
  //  }
  // }

  let userId;

  if (req.session.userId) {
    userId = req.session.userId;

    let memosQueryResult = (
      await pgClient.query(
        `select memos.id as memo_id,memos.content,memos.image,(case when memo_id is not null then true else false end )as liked from memos left join (select memo_id from user_like_memo where user_id = ${userId}) as like_list on memos.id = like_list.memo_id ORDER BY created_at ASC;`
      )
    ).rows;

    res.json({ data: { memos: memosQueryResult } });
  } else {
    let memosQueryResult = (
      await pgClient.query(
        "SELECT id,content,image FROM memos ORDER BY created_at ASC "
      )
    ).rows;

    res.json({ data: { memos: memosQueryResult } });
  }
}

async function toggleLike(req: Request, res: Response) {
  let memoId = req.query.id;

  let memoLikeQueryResult = await pgClient.query(
    "SELECT * from user_like_memo where user_id =$1 AND memo_id = $2",
    [req.session.userId, memoId]
  );

  if (memoLikeQueryResult.rowCount == 0) {
    let memoLikeInsertResult = await pgClient.query(
      "INSERT INTO user_like_memo (user_id,memo_id) VALUES ($1,$2)",
      [req.session.userId, memoId]
    );

    console.log(memoLikeInsertResult);
    if (memoLikeInsertResult.rowCount) {
      res.json({ message: "like success" });
    }
  } else {
    let memoLikeDeleteResult = await pgClient.query(
      "DELETE FROM user_like_memo WHERE user_id =$1 AND memo_id=$2",
      [req.session.userId, memoId]
    );
    console.log(memoLikeDeleteResult);
    if (memoLikeDeleteResult) {
      res.json({ message: "unlike success" });
    }
  }
}
