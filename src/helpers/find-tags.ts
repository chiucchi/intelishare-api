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
    const commonInvolveds = inv.involveds.filter((involved: string) =>
      investigation.involveds.includes(involved)
    );

    console.log(commonInvolveds, "commonInvolveds");

    if (commonInvolveds.length >= 1) {
      // só checa as tags se os envolvidos forem os mesmos
      const commonTags = inv.tags.filter((tag: string) =>
        investigationTags.includes(tag)
      );
      if (commonTags.length >= 1) {
        // mudar o numero 1 para a quant de tags em comuns devem ser achadas entre as investigações
        recommendedInvestigations.push(inv);
      }
      // usar o algoritmo para checar uf de origem também?
    }
  }

  console.log(recommendedInvestigations, "recommendedInvestigations");

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

    if (userAuthor.id !== user.id) {
      // pra não pegar as próprias investigações
      if (inv.isPublic === false) {
        userNotifications.push({
          type: "access-request",
          title: "Pedido de acesso à investigação",
          description: `${userAuthor?.name} pediu acesso à sua investigação ${inv?.name}`,
          relatedInvestigationId: investigation.id,
          relatedInvestigationAuthor: userAuthor.id,
          response: false,
        }); // mandar investigação pedindo acesso a investigação privada
        userAuthorNotifications.push({
          type: "inform-ask-access",
          title: `A investigação ${inv.name} pode conter informações relevantes à sua investigação ${investigation.name}`,
          description: `A investigação ${inv.name} é privada e para visualizar é necessário acesso`,
          relatedInvestigationId: inv.id,
          relatedInvestigationAuthor: user.id,
          askAccess: false,
        }); // mandar notificação avisando que achou uma investigação correlata a dele porém privada
      } else if (investigation.isPublic === false) {
        userAuthorNotifications.push({
          type: "access-request",
          title: "Pedido de acesso à investigação",
          description: `${userAuthor?.name} pediu acesso à sua investigação ${inv?.name}`,
          relatedInvestigationId: investigation.id,
          relatedInvestigationAuthor: user.id,
          response: false,
        }); // mandar investigação pedindo acesso a investigação privada
        userNotifications.push({
          type: "inform-ask-access",
          title: `A investigação ${investigation.name}  pode conter informações relevantes à sua investigação ${inv.name}`,
          description: `A investigação ${investigation.name} é privada e para visualizar é necessário acesso`,
          relatedInvestigationId: investigation.id,
          relatedInvestigationAuthor: userAuthor.id,
          askAccess: false,
        }); // mandar notificação avisando que achou uma investigação correlata a dele porém privada
      } else {
        userNotifications.push({
          type: "inform",
          title: `A investigação ${investigation.name}  pode conter informações relevantes à sua investigação ${inv.name}`,
          description: "",
          relatedInvestigationId: inv.id,
          relatedInvestigationAuthor: user.id,
        }); // mandar investigação pedindo acesso a investigação privada
        userAuthorNotifications.push({
          type: "inform",
          title: `A investigação ${inv.name}  pode conter informações relevantes à sua investigação ${investigation.name}`,
          description: ``,
          relatedInvestigationId: inv.id,
          relatedInvestigationAuthor: user.id,
        });
      }
    }

    // const parsedNotifications = JSON.stringify(userNotifications);
    // const parsedAuthorNotifications = JSON.stringify(userAuthorNotifications);

    await userRepository.save(user); // salva as notificações do usuário relacionado com a investigação recomendada
    await userRepository.save(userAuthor); // salva as notificações do usuário que criou a investigação
  }
};
