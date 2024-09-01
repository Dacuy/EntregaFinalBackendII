import mongoose from 'mongoose';
const collection = "Carts"

const cartSchema = new mongoose.Schema({
    products: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
        },
    ],
    userRelatedTo: String
});

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;
