export class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createCartService() {
    const cart = await this.dao.create();
    return cart;
  }

  async getCartsService() {
    return await this.dao.readMany({});
  }

  async getCartByIdService(id) {
    const cartForId = await this.dao.readOne(id);

    return cartForId;
  }

  async updateOneService(id, data) {
    return this.dao.updateOne(id, data);
  }

  async deleteOneService(id) {
    return this.dao.deleteOne(id);
  }
  async deleteManyService(id) {
    return this.dao.deleteMany(id);
  }
}
