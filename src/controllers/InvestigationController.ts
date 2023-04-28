import { Request, Response } from "express";
import { investigationRepository } from "../repositories/investigationRepository";
import { BadRequestError } from "../helpers/api-errors";
import { returnId } from "../helpers/user-id";
import { userRepository } from "../repositories/userRepository";

export class InvestigationController {
  async create(req: Request, res: Response) {
    const id = returnId(res, req);
    const { name, author, date, involveds, tags, permitedUsers, isPublic } =
      req.body;

    const investigationExists = await investigationRepository.findOneBy({
      name,
    });

    if (investigationExists) {
      return res
        .status(400)
        .json({ message: "Uma investigação com esse nome já existe" });
      /* throw new BadRequestError(
        "Investigation with that name already exists, please change the name"
      ); */
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
    const id = returnId(res, req);

    const investigations = await investigationRepository.find({
      where: { user: { id } },
      relations: ["user"],
    });

    return res.status(200).json(investigations);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const investigation = await investigationRepository.findOneBy({
      id: parseInt(id),
    });

    if (!investigation) {
      return res.status(400).json({ message: "Investigação não encontrada" });
    }

    const { name, author, date, involveds, tags, permitedUsers, isPublic } =
      req.body;

    investigation.name = name ?? investigation.name;
    investigation.author = author ?? investigation.author;
    investigation.date = date ?? investigation.date;
    investigation.involveds = involveds ?? investigation.involveds;
    investigation.tags = tags ?? investigation.tags;
    investigation.permitedUsers = permitedUsers ?? investigation.permitedUsers;
    investigation.isPublic = isPublic ?? investigation.isPublic;

    await investigationRepository.save(investigation);

    return res.status(200).json(investigation);
  }

  async detailById(req: Request, res: Response) {
    const { id } = req.params;

    const investigation = await investigationRepository.findOneBy({
      id: parseInt(id),
    });

    if (!investigation) {
      return res.status(400).json({ message: "Investigação não encontrada" });
    }

    return res.status(200).json(investigation);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const investigation = await investigationRepository.findOneBy({
      id: parseInt(id),
    });

    // conferir se a ivnestigação é de quem mandou a requisição

    if (!investigation) {
      return res.status(400).json({ message: "Investigação não encontrada" });
    }

    await investigationRepository.delete(investigation.id);

    return res.status(200).json({ message: "Investigação deletada" });
  }
}
