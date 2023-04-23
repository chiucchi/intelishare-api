import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, UnauthorizedError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password, telephone, birthDate, uf } = req.body;

        const userExists = await userRepository.findOneBy({ email });

        if (userExists) {
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
            throw new BadRequestError("Email or password incorrect");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new BadRequestError("Email or password incorrect");
        }

        const token = jwt.sign({ id: user.id, name: user.name, notifications: user.notifications }, process.env.JWT_PASS ?? '', { expiresIn: '1d'})

        const { password: _, ...userWithoutPassword } = user;

        return res.json({user: userWithoutPassword, token: token});
    }

    async getProfile(req: Request, res: Response) {
        

        return res.json(req.user);
    }
}
