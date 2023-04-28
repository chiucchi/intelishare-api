import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { InvestigationController } from "./controllers/InvestigationController";

const routes = Router();

routes.post("/user", new UserController().create);

routes.post("/login", new UserController().login);

routes.use(authMiddleware);

routes.get("/profile", new UserController().getProfile);

// create investigations crud routes here
routes.post("/investigations", new InvestigationController().create);
routes.get("/investigations", new InvestigationController().list);
routes.get("/profile/investigations", new InvestigationController().listByUser);
routes.get("/investigations/:id", new InvestigationController().detailById);
routes.patch("/investigations/:id", new InvestigationController().update);
routes.delete("/investigations/:id", new InvestigationController().delete);

export default routes;
