import { Response } from "express";
import { Investigation } from "../entities/Investigation";
import { investigationRepository } from "../repositories/investigationRepository";
import { userRepository } from "../repositories/userRepository";

export const findRelatedTags = async (
  res: Response,
  investigation: Investigation
) => {
  const investigationTags = investigation.tags; // pega as tags da investigação criada
  const allInvestigations = await investigationRepository.find(); // pega todas as investigações do banco

  const recommendedInvestigations = [];
  for (const inv of allInvestigations) {
    const commonTags = inv.tags.filter((tag: string) =>
      investigationTags.includes(tag)
    );
    if (commonTags.length >= 1) {
      // mais de 5 tags em comuns devem ser achadas entre as investigações
      recommendedInvestigations.push(inv);
    }
  }

  console.log(recommendedInvestigations);

  // atualizar o campo de notificações dos usuários relacionados com as investigações recomendadas
  const userAuthor = await userRepository.findOneBy({
    id: investigation.user.id,
  });

  if (!userAuthor) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }

  const userAuthorNotifications = userAuthor.notifications; // pega as notificações do usuário que criou a investigação

  for (const inv of recommendedInvestigations) {
    const user = await userRepository.findOneBy({ id: inv.permitedUsers[0] }); // pega o usuário relacionado com a investigação recomendada

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const userNotifications = user.notifications; // pega as notificações do usuário relacionado com a investigação recomendada

    userNotifications.push({
      message: `A investigação ${investigation.name} possui tags em comum com a sua investigação ${inv.name}`, // manda uma notificação para o usuário relacionado com a investigação recomendada
      relatedInvestigationId: investigation.id,
      relatedInvestigationAuthor: investigation.user.id,
    });

    userAuthorNotifications.push({
      message: `A investigação ${inv.name} possui tags em comum com a sua investigação ${investigation.name}`, // manda uma notificação para o usuário que criou a investigação
      relatedInvestigationId: inv.id,
      relatedInvestigationAuthor: inv.permitedUsers[0],
    });

    await userRepository.save(user); // salva as notificações do usuário relacionado com a investigação recomendada
    await userRepository.save(userAuthor); // salva as notificações do usuário que criou a investigação
  }
};
