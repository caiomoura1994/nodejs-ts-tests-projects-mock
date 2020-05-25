import request from "supertest";
import "mocha";
import { expect } from "chai";
import app from "../src";
import { ProjectInterface } from "../src/index.interface";

describe("get - /projects", () => {
  it("Should return all Projects", async () => {
    const { body } = await request(app).get("/projects").expect(200);
    const allProjects = body as ProjectInterface[];
    const [firsProject] = allProjects;
    expect(allProjects).length(1);

    expect(firsProject).haveOwnProperty("id");
    expect(firsProject).haveOwnProperty("name");
    expect(firsProject).haveOwnProperty("description");
  });
});

describe("get - /projects/:id", () => {
  it("Should return project with 'firstId'", async () => {
    const { body } = await request(app).get("/projects/firstId").expect(200);
    const project = body as ProjectInterface;

    expect(project).haveOwnProperty("id");
    expect(project).haveOwnProperty("name");
    expect(project).haveOwnProperty("description");
  });

  it("Should return ERROR", async () => {
    const { body } = await request(app).get("/projects/errorId").expect(400);
    expect(body).haveOwnProperty("errMessage");
  });
});

describe("post - /projects", () => {
  it("Should create a project", async () => {
    const newProject = {
      name: "new Project Name",
      description: "new Project Description",
    } as ProjectInterface;
    const { body } = await request(app)
      .post("/projects")
      .send(newProject)
      .expect(200);

    expect(body).haveOwnProperty("id");
    expect(body).haveOwnProperty("name", newProject.name);
    expect(body).haveOwnProperty("description", newProject.description);
  });
});

describe("put - /projects/:id", () => {
  it("Should update project with firstId", async () => {
    const payloadToUpdate = {
      name: "Name",
      description: "Description",
    } as ProjectInterface;

    const { body } = await request(app)
      .put("/projects/firstId")
      .send(payloadToUpdate)
      .set("Authorization", "TOKEN")
      .expect(200);

    expect(body).haveOwnProperty("id", "firstId");
    expect(body).haveOwnProperty("name", payloadToUpdate.name);
    expect(body).haveOwnProperty("description", payloadToUpdate.description);
  });
});

describe("delete - /projects/:id", () => {
  it("Should delete project with firstId", async () => {
    await request(app)
      .delete("/projects/firstId")
      .set("Authorization", "TOKEN")
      .expect(204);
    const { body } = await request(app).get("/projects");
    const projects = body as ProjectInterface[];
    expect(projects).to.not.include({ id: "firstId" });
  });

  it("Should return error cod", async () => {
    const { body } = await request(app).delete("/projects/firstId").expect(400);
    expect(body).haveOwnProperty("errMessage");
  });
});
