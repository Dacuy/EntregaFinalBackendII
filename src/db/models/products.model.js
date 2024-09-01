import mongoose from 'mongoose';
const collection = "Products"
const { Schema } = mongoose;
const productSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    stock:Number,
    category:String,
    image: String,
    restockData: String
});

const productModel = mongoose.model(collection, productSchema);

export default productModel;