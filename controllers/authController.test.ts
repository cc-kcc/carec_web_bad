import { Client, QueryResult } from "pg";
import AuthService from "../services/authService";
import AuthController from "./authController";
import {Request, Response} from "express";
import { UserQueryType } from "../utils/types";
import * as hash from "../utils/hash"; 
let authService: AuthService;
let authController: AuthController;
let req: Request = {} as Request;
let res: Response = {} as Response;

beforeEach(() => {
    authService = new AuthService({} as any)
    authController = new AuthController(authService)
   
})
describe("testing Register", () => {
    beforeEach(() => {
        req = {
            body: { email: "", username: "", password:"" }
        } as Request
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as any as Response
    })
    it("should response status 200, msg: register successful ", async() => {
        authService.findByEmail = jest.fn(async () => undefined)
        const result = {
            rows: [
                {id: 2}
            ]
        } as QueryResult<any>
    
        authService.createAccount = jest.fn(async () => result)
        await authController.register(req, res);
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            msg: "register successful",
            userId: 2,
          })
    })

    it("should response status 400, Duplicate entry. ", async () => {
        const value: UserQueryType = {
            id: 0,
            username: "",
            password: ""
        }
        authService.findByEmail = jest.fn(async () => value)
        await authController.register(req, res);
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "Duplicate 12312 entry." })
    })

    it("should response status 400, catch error ", async () => {
        authService.findByEmail = jest.fn(() => {
            throw new Error("Testcase error123")
        })
        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "Testcase error123" })
    })
})

describe("testing Login", () => {
    beforeEach(() => {
        req = {
            body: { email: "", password: "" },
            session: {save: () => {}}
        } as Request
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as any as Response
    })

    it("should response status 200, msg: register successful ", async() => {
        const value: UserQueryType = {
            id: 0,
            username: "",
            password: ""
        }
        const mockGetData = jest.spyOn(hash, "checkPassword").mockResolvedValue(true);
        authService.findByEmail = jest.fn(async () => value)
        await authController.login(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: "login success",
            data: { username: value.username },
          })

    })

    it("should response status 400, wrong password. ", async () => {
        const value: UserQueryType = {
            id: 0,
            username: "",
            password: ""
        }
        const mockGetData = jest.spyOn(hash, "checkPassword").mockResolvedValue(false);
        authService.findByEmail = jest.fn(async () => value)
        await authController.login(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "wrong password" })
    })

    it("should response status 400, Login Failed ", async () => {
        authService.findByEmail = jest.fn(async () => undefined)
        await authController.login(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "Login Failed" })
    })
    
})
