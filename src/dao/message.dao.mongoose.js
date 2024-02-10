import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";

const messageSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    user: { type: String, required: true },
    emailUser: { type: String, required: true },
    content: { type: String, required: true },
  },
  { versionKey: false }
);

export const messagesManager = model("messages", messageSchema);

class MessagesDaoMongoose {
  async create(data) {
    const message = await messagesManager.create(data);
    return message.toObject();
  }
  async readOne(query) {
    return await messagesManager.findOne(query).lean();
  }
  async readMany(query) {
    return await messagesManager.find(query).lean();
  }
  async updateOne(id, data) {
    return await messagesManager
      .findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
      .lean();
  }
  async deleteOne(id) {
    return await messagesManager.findOneAndDelete({ _id: id }).lean();
  }
}

export const messagesDaoMongoose = new MessagesDaoMongoose();
