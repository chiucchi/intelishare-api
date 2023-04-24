import { Request } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./api-errors";

type JwtPayload = {
  id: number;
};
// return user id from token on request header
export const returnId = (req: Request) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError("Não autorizado");
  }

  const token = authorization.split(" ")[1];

  const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as JwtPayload;

  return id;
};
