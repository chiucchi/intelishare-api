import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password, telephone, birthDate, uf } = req.body;

    const userExists = await userRepository.findOneBy({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Erro na criação, favor tentar novamente" });
      throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      telephone,
      birthDate,
      uf,
      notifications: [],
    });

    await userRepository.save(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json(userWithoutPassword);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
      throw new BadRequestError("Email or password incorrect");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
      throw new BadRequestError("Email or password incorrect");
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        notifications: user.notifications,
      },
      process.env.JWT_PASS ?? ""
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({ user: userWithoutPassword, token: token });
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  async update(req: Request, res: Response) {} // TODO -- pensar se o role de notificacao vai ser usado aqui tbm ou criarei uma funcao separada

  async delete(req: Request, res: Response) {} // TODO

  async listUsers(req: Request, res: Response) {
    const users = await userRepository.find();

    return res.json(users);
  }

  // list user investigations
}
