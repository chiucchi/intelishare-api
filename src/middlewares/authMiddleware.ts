import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../helpers/api-errors";
import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";
import { returnId } from "../helpers/user-id";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = returnId(res, req);

  const user = await userRepository.findOneBy({ id });

  if (!user) {
    return res.status(401).json({ message: "Usuário não encontrado" });
    throw new BadRequestError("User not found");
  }

  const { password: _, ...loggedUser } = user;

  req.user = loggedUser;

  next();
};
