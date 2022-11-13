import express, { NextFunction, Request, Response } from "express";
import { uuid } from "uuidv4";
import { IProjectInterface } from "./index.interface";

const app = express();
app.use(express.json());

const projectsMock = [
  {
    id: "firstId",
    name: "First Company Name",
    description: "First Description",
  },
] as IProjectInterface[];

export function fakeAuthTokenMiddleware(request: Request, res: Response, next: NextFunction) {
  const { authorization } = request.headers;

  if (authorization != "TOKEN")
    return res.status(400).json({ errMessage: "Token inválido" });

  return next();
}

app.get("/projects", (_, res) => {
  return res.json(projectsMock);
});

app.get("/projects/:id", (request, res) => {
  const { id } = request.params;

  const projectIndex = projectsMock.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return res.status(400).json({ errMessage: "Projeto nã encontrado" });
  }
  return res.json(projectsMock[projectIndex]);
});

app.post("/projects", (request, res) => {
  const newProjectBody = request.body as IProjectInterface;
  const newProject = { ...newProjectBody, id: uuid() };
  projectsMock.push(newProject);

  return res.json(newProject);
});

app.put("/projects/:id", fakeAuthTokenMiddleware, (request, res) => {
  const { id } = request.params;

  const projectIndex = projectsMock.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ errMessage: "Projeto nã encontrado" });
  }

  const projectBody = request.body as IProjectInterface;
  const projectUpdatedPayload = { ...projectBody, id };

  projectsMock[projectIndex] = projectUpdatedPayload;

  return res.json(projectUpdatedPayload);
});

app.delete("/projects/:id", fakeAuthTokenMiddleware, (request, res) => {
  const { id } = request.params;

  const projectIndex = projectsMock.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return res.status(400).json({ errMessage: "Projeto nã encontrado" });
  }

  projectsMock.splice(projectIndex, 1);

  return res.status(204).send();
});

app.listen(3000, () => {
  console.log(`[SERVER] Running at http://localhost:3000`);
});

export default app;
