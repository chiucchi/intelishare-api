import { AppDataSource } from "../data-source";
import { Investigation } from "../entities/Investigation";

export const investigationRepository =
  AppDataSource.getRepository(Investigation);
