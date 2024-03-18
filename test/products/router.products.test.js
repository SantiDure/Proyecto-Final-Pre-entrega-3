import supertest from "supertest";
import { connectDb } from "../../src/dao/mongodb.js";

const TEST_PORT = 8080;
const baseURL = `http://localhost:${TEST_PORT}`;

const requester = supertest(baseURL);
describe("Router de Products", function () {
  describe("GET api/products/:pid", function () {
    describe("getProductControllerId", function () {
      describe("debe traer un producto por un id pasado por url", function () {
        it("debe tirar error si el producto buscado no existe", async function () {
          const pid = "idfalso";
          await connectDb();
          await requester.get(`/api/products/${pid}`).expect(404);
        });
      });
    });
  });
});
