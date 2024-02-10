import { messagesDaoMongoose } from "../dao/message.dao.mongoose.js";

class MessageService {
  async createMessageService(data) {
    const message = await messageDaoMongoose.create(data);
    return message;
  }

  async getMessagesService() {
    return await messagesDaoMongoose.readMany({});
  }

  async getMessageByIdService(id) {
    const messageForId = await messagesDaoMongoose.readOne({ _id: id });
    return messageForId;
  }

  async updateOneService(id, data) {
    return messagesDaoMongoose.updateOne(id, data);
  }

  async deleteOneService(id) {
    return messagesDaoMongoose.deleteOne(id);
  }
}

export const messageService = new MessageService();
