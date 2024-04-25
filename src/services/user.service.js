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

  async getUserByIdService(query) {
    const userForId = await this.dao.readOne(query);
    return userForId;
  }

  async updateOneService(id, query) {
    return this.dao.updateOne(id, query);
  }

  async deleteOneService(id) {
    return this.dao.deleteOne(id);
  }

  async deleteInactiveService(query) {
    return this.dao.deleteInactive(query);
  }
}
