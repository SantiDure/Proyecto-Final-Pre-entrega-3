import { randomUUID } from "crypto";
import { Schema } from "mongoose";
import { model } from "mongoose";
const ticketSchema = new Schema(
  {
    code: { type: String, default: randomUUID },
    purchase_datetime: {
      type: String,
      default: () => {
        return new Date(Date.now());
      },
    },
    amount: { type: Number, default: 0 },
    purchaser: { type: String, required: true },
  },
  { versionKey: false }
);

export const ticketsManager = model("tickets", ticketSchema);

export class TicketDaoMongoose {
  async create(data) {
    const ticket = await ticketsManager.create(data);
    return ticket;
  }
  async readOne(id) {
    const ticketForId = await ticketsManager.findOne({ _id: id });
    return toPOJO(ticketForId);
  }
  async readMany(query) {
    return await ticketsManager.find(query);
  }
  async updateOne(id, data) {
    return await ticketsManager.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
  }

  async deleteOne(id) {
    return await ticketsManager.findOneAndDelete({ _id: id });
  }
}
