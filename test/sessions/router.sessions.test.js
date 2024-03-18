import supertest from "supertest";
import { connectDb, disconnectDb } from "../../src/dao/mongodb.js";
import { ServerToUp } from "../../src/app/app.js";
import * as chai from "chai";
chai.should();
const TEST_PORT = 8080;
const baseURL = `http://localhost:${TEST_PORT}`;

const requester = supertest(baseURL);

describe("API Rest", function () {
  this.timeout(200000);

  before(async function () {
    await connectDb();
    this.server = new ServerToUp();
    await this.server.connect(TEST_PORT);
  });

  after(async function () {
    await this.server.disconnect();
    await disconnectDb();
  });

  describe("Router de Sessions", function () {
    describe("POST /api/sessions/", function () {
      it("debe devolver un codigo 401 al fallar el login", async function () {
        const requester = supertest.agent(baseURL);
        await requester
          .post(`/api/sessions/`)
          .send({ email: "", pasword: "" })
          .expect(401);
      });
      it("debe devolver un codigo 201 al loguearse correctamente", async function () {
        const requester = supertest.agent(baseURL);

        await requester
          .post(`/api/sessions/`)
          .set("Content-Type", "application/json")
          .send({ email: "admin@coder.com", password: "admin" })
          .expect(201);
      });
    });
    describe("GET /api/sessions/current", function () {
      it("debe devolver un codigo 200 y la informacion del usuario logueado actualmente", async function () {
        const requester = supertest.agent(baseURL);

        const { body } = await requester
          .post(`/api/sessions/`)
          .set("Content-Type", "application/json")
          .send({ email: "admin@coder.com", password: "admin" });

        await requester.get(`/api/sessions/current`).expect(200);
        body.should.not.be.null;
      });
    });
  });
});
