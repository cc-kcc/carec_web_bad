import formidable from "formidable";
import { Request, Response } from "express";
import MemoService from "../services/memoService";
import { form, formUpload } from "../utils/upload";

export default class MemoController {
  constructor(private memoService: MemoService) {}

  deleteMemoById = async (req: Request, res: Response) => {
    try {
      let targetId = parseInt(req.query.id as string);

      // let memoDeleteResult = await pgClient.query(
      //   "DELETE FROM memos WHERE id =$1",
      //   [targetId]
      // );
      await this.memoService.deleteByMemoId(targetId);

      res.json({ message: "Delete memo successful" });
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: "Delete memo failed" });
    }
  };

  updateMemoById = async (req: Request, res: Response) => {
    const form = formidable({
      uploadDir: __dirname + "/../uploads",
      keepExtensions: true,
      minFileSize: 0,
      allowEmptyFiles: true,
    });

    let memoContent: string;
    let memoImage: string;
    let memoId: number;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Internal Server Error" });
      }

      if (fields.content) {
        memoContent = fields.content[0];
      }
      if (fields.id) {
        memoId = parseInt(fields.id[0]);
      }
      if (files.photo) {
        memoImage = files.photo[0].newFilename;
      }

      let memoUpdateResult = await this.memoService.updateMemo(
        memoContent,
        memoImage,
        memoId
      );
      // let memoUpdateResult = await pgClient.query(
      //   "UPDATE memos SET content=$1,image=$2 WHERE id = $3 RETURNING *",
      //   [memoContent, memoImage, memoId]
      // );

      console.log(memoUpdateResult);
      if (memoUpdateResult) {
        res.json({
          message: "update success",
        });
      }
    });
  };

  createMemo = async (req: Request, res: Response) => {
    console.log(req);

    try {
      const { content, image } = await formUpload(form, req);
      console.log({ content, image });
      let memoInsertResult = await this.memoService.createMemo(content, image);
      res.status(200).json({
        data: {
          id: memoInsertResult.rows[0].id,
          photo: memoInsertResult.rows[0].image,
        },
      });
    } catch (e) {
      res.status(500).json({ message: "Internal server erorr!" });
    }
  };

  //   createMemo = async (req: Request, res: Response) => {
  //     try {
  //       const { fields, files } = await formParse(form, req);

  //       let memoContent = "";
  //       let memoImage = "";
  //       if (fields.content) {
  //         memoContent = fields.content[0];
  //       }

  //       if (Array.isArray(files.photo)) {
  //         memoImage = files.photo[0].newFilename;
  //       }
  //       console.log({ memoContent, memoImage });

  //       let memoInsertResult = await this.memoService.createMemo(
  //         memoContent,
  //         memoImage
  //       );

  //       res.status(200).json({
  //         data: {
  //           id: memoInsertResult.rows[0].id,
  //           photo: memoInsertResult.rows[0].image,
  //         },
  //       });
  //       return
  //     } catch (e: any) {
  //       res.status(400).json({
  //         msg: e.message,
  //       });
  //     }
  //   };
}
