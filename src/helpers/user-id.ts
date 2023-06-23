import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./api-errors";

type JwtPayload = {
  id: number;
};
// return user id from token on request header
export const returnId = (res: Response, req: Request) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ message: "Não autorizado" });
    /* throw new UnauthorizedError("Não autorizado"); */
  } else {
    const token = authorization.split(" ")[1];

    const teste = jwt.verify(
      token,
      process.env.JWT_PASS ?? "",
      function (err, decoded) {
        if (err?.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Favor logar novamente" });
          throw new UnauthorizedError("Token expirado, favor logar novamente");
        }
        return decoded;
      }
    ) as unknown as JwtPayload;

    return teste?.id;
  }
};
