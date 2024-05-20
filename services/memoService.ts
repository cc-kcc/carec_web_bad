import { Client, QueryResult } from "pg";
import { UserQueryType } from "../utils/types";
import { Knex } from "knex";

export default class MemoService {
    // constructor(private pgClient: Client) {}
    private pgClient: Client;
    constructor(pgClient: Client, private knex: Knex) {
        this.pgClient = pgClient
    }

    async deleteByMemoId(memoId: number  ) {
        await this.knex("user_like_memo").delete().where("memo_id", memoId)
        const result = await this.knex("memos").delete().where("id", memoId)
        return result

        // let memoDeleteResult = await pgClient.query(
        //     "DELETE FROM memos WHERE id =$1",
        //     [targetId]
        //   );
    }
    async updateMemo(content: string, image: string, memoId: number) {
        // const result = await this.knex.raw("UPDATE memos SET content=?,image=? WHERE id = ? RETURNING *", [memoContent, memoImage, memoId])
        const result = await this.knex.table("memos").update({
            content,
            image
        }).where("id", memoId)

        return  result
        // let memoUpdateResult = await pgClient.query(
        //     "UPDATE memos SET content=$1,image=$2 WHERE id = $3 RETURNING *",
        //     [memoContent, memoImage, memoId]
        //   );
    }
    async createMemo(memoContent: string, memoImage: string):Promise<QueryResult<any>> {
        const result =  await this.pgClient.query(
            "INSERT INTO memos (content,image,created_at,updated_at) VALUES ($1,$2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id,image",
            [memoContent, memoImage]
          );
          return result
    }
}