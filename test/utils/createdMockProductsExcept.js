export function createdMockProductsExcept(...fields) {
  const productsData = {
    _id: "hjhghguirgh32424fdsf",
    title: "Test",
    description: "Este es el mock del test de products",
    code: "TEST01",
    prece: 21,
    status: true,
    stock: 10,
    category: "test",
    owner: "test",
  };

  for (const field of fields) {
    delete productsData[field];
  }

  return productsData;
}
