import mongoose from "mongoose";
const collection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: String,
    amount: Number,
    purchaser: String
})
const ticketModel = mongoose.model(collection, ticketSchema);

export default ticketModel;