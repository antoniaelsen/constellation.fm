import { NextFunction, Request, Response } from "express";

export type MiddlewareFunc = (req: Request, res: Response, next: NextFunction) => void;