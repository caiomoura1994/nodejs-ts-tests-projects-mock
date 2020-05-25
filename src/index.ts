import express from "express";
import { uuid } from "uuidv4";
import { ProjectInterface } from "./index.interface";

const app = express();
app.use(express.json());

const projectsMock = [
  {
    id: "firstId",
    name: "First Company Name",
    description: "First Description",
  },
] as ProjectInterface[];

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
  const newProjectBody = request.body as ProjectInterface;
  const newProject = { ...newProjectBody, id: uuid() };
  projectsMock.push(newProject);

  return res.json(newProject);
});

app.put("/projects/:id", (request, res) => {
  const { id } = request.params;

  const projectIndex = projectsMock.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ errMessage: "Projeto nã encontrado" });
  }

  const projectBody = request.body as ProjectInterface;
  const projectUpdatedPayload = { ...projectBody, id };

  projectsMock[projectIndex] = projectUpdatedPayload;

  return res.json(projectUpdatedPayload);
});

app.delete("/projects/:id", (request, res) => {
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
