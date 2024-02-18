import { faker } from "@faker-js/faker";
function randomBoolean() {
  return Math.random() < 0.5; // Retorna true si el número aleatorio es menor que 0.5, de lo contrario, retorna false
}
async function createRandomProduct() {
  const product = {
    // _id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.commerce.isbn(13),
    price: Number(faker.commerce.price()),
    status: randomBoolean(),
    stock: Number(faker.commerce.price({ max: 200 })),
    category: faker.commerce.productMaterial(),
    thumbnail: [
      `${faker.commerce.productName()}.com`.split(" ").join("").toLowerCase(),
    ],
  };
  return product;
}

export class ProductsDaoMock {
  async create() {
    let products = [];
    for (let index = 0; index < 100; index++) {
      const newProduct = await createRandomProduct();
      products.push(newProduct);
    }
    return products;
  }
  async readOne() {
    return "Not implemented";
  }
  async readMany() {
    return "Not implemented";
  }
  async updateOne() {
    return "Not implemented";
  }

  async deleteOne() {
    return "Not implemented";
  }
}
