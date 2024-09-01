import cartModel from "../models/carts.model.js";

export default class CartsDao {
    get(){
        return cartModel.find({})
    }
    getOne(params){
        return cartModel.findOne(params);
    }
    create(cart){
        return cartModel.create(cart);
    }
    update(id,cart){
        return cartModel.updateOne({_id:id}, cart)
    }
    delete(id){
        return cartModel .deleteOne({_id: id});
    }
}