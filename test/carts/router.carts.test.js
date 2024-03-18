import supertest from "supertest";
import { cartService, connectDb, disconnectDb } from "../../src/dao/mongodb.js";
import { ServerToUp } from "../../src/app/app.js";
import assert from "node:assert";
import * as chai from "chai";
chai.should();
const TEST_PORT = 8080;
const baseURL = `http://localhost:${TEST_PORT}`;

const requester = supertest(baseURL);

describe("Cart Router", function () {
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
  describe("POST /api/carts/", function () {
    describe("crear carrito", function () {
      it("debe devolver un codigo de estado 201 en caso de crearse correctamente", async function () {
        const requester = supertest.agent(baseURL);

        await requester.post(`/api/carts/`).expect(201);
      });
    });
  });
  describe("GET /api/carts/", function () {
    it("debe devolver un codigo de estado 200 en caso de poder traer todos los carritos", async function () {
      const requester = supertest.agent(baseURL);

      await requester.get(`/api/carts/`).expect(200);
    });
  });
  describe("debe crear un cart", function () {
    it("crea un cart y comprueba que tenga _id", async function () {
      const cart = await cartService.createCartService();
      const buscado = await cartService.getCartByIdService(cart._id);
      buscado.should.have.property("_id", cart._id);
    });
  });
});
