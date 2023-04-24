import { Request, Response } from "express";
import { investigationRepository } from "../repositories/investigationRepository";
import { BadRequestError } from "../helpers/api-errors";
import { returnId } from "../helpers/user-id";
import { userRepository } from "../repositories/userRepository";

export class InvestigationController {
  async create(req: Request, res: Response) {
    const id = returnId(req);
    const { name, author, date, involveds, tags, permitedUsers, isPublic } =
      req.body;

    const investigationExists = await investigationRepository.findOneBy({
      name,
    });

    if (investigationExists) {
      throw new BadRequestError(
        "Investigation with that name already exists, please change the name"
      );
    }

    const user = await userRepository.findOneBy({ id });

    const newInvestigation = investigationRepository.create({
      name,
      author,
      date,
      tags,
      involveds,
      permitedUsers,
      isPublic,
      uf: user?.uf ?? "",
      user: user ?? undefined,
    });

    await investigationRepository.save(newInvestigation);

    return res.status(201).json(newInvestigation);
  }

  async list(req: Request, res: Response) {
    // retorna todas as investigações cujo isPublic é true
    const investigations = await investigationRepository.find({
      where: { isPublic: true },
    });

    // adicionar paginação nisso aqui

    return res.status(200).json(investigations);
  }

  async listByUser(req: Request, res: Response) {
    const id = returnId(req);

    const investigations = await investigationRepository.find({
      where: { user: { id } },
      relations: ["user"],
    });

    return res.status(200).json(investigations);
  }

  async update(req: Request, res: Response) {} // TODO

  async delete(req: Request, res: Response) {
    /* const { id } = req.params;

    const investigation = await investigationRepository.findOneBy({ id });

    if (!investigation) {
      throw new BadRequestError("Investigation not found");
    }

    await investigationRepository.delete(investigation);

    return res.status(200).json({ message: "Investigation deleted" }); */
  }
}
