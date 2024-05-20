import { Client, QueryResult } from "pg"
import MemoService from "../services/memoService"
import MemoController from "./memoController"
import { Request, Response } from "express";
import * as upload from "../utils/upload";


describe("testing createMemo", () => {
    let memoService: MemoService;
    let memoController: MemoController;
    let req = {} as Request
    let res = {} as Response
    beforeEach(() => {
        memoService = new MemoService({} as Client)
        memoController = new MemoController(memoService)
        req = {} as Request
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as any as Response
    })


    it("testing upload successfully", async () => {
        const resolveObj = {
            content: "1",
            image: "image1",
        }
        jest.spyOn(upload, "formUpload").mockResolvedValue(resolveObj)
        memoService.createMemo = jest.fn(async() => ({
            rows: [{
                id: 1,
                image: resolveObj.image
            }
            ]
        }) as QueryResult)

        await memoController.createMemo(req,res)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
            data: {
              id:1,
              photo: resolveObj.image,
            },
          })

    })

    it.only("testing upload fail", async () => {
        const resolveObj = {
            content: "1",
            image: "image1",
        }
        jest.spyOn(upload, "formUpload").mockRejectedValue(new Error("error"))
        await memoController.createMemo(req,res)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server erorr!" })
    })
    
})