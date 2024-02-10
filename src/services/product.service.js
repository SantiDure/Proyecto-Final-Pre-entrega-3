export class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async createProductService(data) {
    const product = await this.dao.create(data);
    return product;
  }

  async getProductsService() {
    return await this.dao.readMany({});
  }

  async getProductByIdService(pid) {
    const productForId = await this.dao.readOne({ _id: pid });
    return productForId;
  }

  async updateOneService(id, data) {
    return this.dao.updateOne(id, data);
  }

  async deleteOneService(id) {
    return this.dao.deleteOne(id);
  }
}
