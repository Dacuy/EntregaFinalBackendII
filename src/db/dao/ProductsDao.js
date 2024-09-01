import productModel from "../models/products.model.js";

export default class ProductsDao {
    get(){
        return productModel.find({})
    }
    getOne(params){
        return productModel.findOne(params);
    }
    create(product){
        return productModel.create(product);
    }
    update(id,product){
        return productModel.updateOne({_id:id}, product)
    }
    delete(id){
        return productModel.deleteOne({_id: id});
    }
}