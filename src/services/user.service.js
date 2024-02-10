export class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async createUserService(data) {
    const user = await this.dao.create(data);
    return user;
  }

  async getUsersService() {
    return await this.dao.readMany({});
  }

  async getUserByIdService(quey) {
    const userForId = await this.dao.readOne(quey);
    return userForId;
  }

  async updateOneService(id, data) {
    return this.dao.updateOne(id, data);
  }

  async deleteOneService(id) {
    return this.dao.deleteOne(id);
  }
}
