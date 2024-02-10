export class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async createTicketService(data) {
    const ticket = await this.dao.create(data);
    return ticket;
  }

  async getTicketService() {
    return await this.dao.readMany({});
  }

  async getTicketByIdService(id) {
    const ticketForId = await this.dao.readOne({ _id: id });
    return ticketForId;
  }

  async updateOneService(id, data) {
    return this.dao.updateOne(id, data);
  }

  async deleteOneService(id) {
    return this.dao.deleteOne(id);
  }
}
