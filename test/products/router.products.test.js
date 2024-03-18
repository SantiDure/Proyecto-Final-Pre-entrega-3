import supertest from "supertest";
import { connectDb, disconnectDb } from "../../src/dao/mongodb.js";
import { ServerToUp } from "../../src/app/app.js";
import { ProductsDaoMock } from "../../src/dao/mock/product.dao.mock.js";
import assert from "node:assert";

const TEST_PORT = 8080;
const baseURL = `http://localhost:${TEST_PORT}`;

const requester = supertest(baseURL);

describe("API Rest", function () {
  this.timeout(20000);

  before(async function () {
    await connectDb();
    this.server = new ServerToUp();
    await this.server.connect(TEST_PORT);
  });

  after(async function () {
    await this.server.disconnect();
    await disconnectDb();
  });

  describe("Router de Products", function () {
    describe("GET /api/products/:pid", function () {
      describe("getProductControllerId", function () {
        describe("debe traer un producto por un id pasado por url", function () {
          it("debe tirar error si el producto buscado no existe", async function () {
            const pid = "idfalso";
            const requester = supertest.agent(baseURL);

            await requester.get(`/api/products/${pid}`).expect(404);
          });
        });
      });
      describe("POST /api/products/", function () {
        describe("al registrar con datos invalidos", function () {
          it("deberia devolver codigo de estado 400 al no pasarle nada en el body", async function () {
            const datosDeProduct = {};
            await requester
              .post("/api/porducts/")
              .send(datosDeProduct)
              .expect(404);
          });
        });
        describe("crear producto", function () {
          it("debe tirar un error al haber datos invalidos", function () {
            assert.throws(() => {
              new ProductsDaoMock({});
            });
          });
        });
      });
    });
  });
});
