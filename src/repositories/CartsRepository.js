export default class CartsRepository {
    constructor(dao){
        this.dao = dao;
    }
    getCarts(){
        return this.dao.get()
    }
    createCart(cart){
        return this.dao.create(cart)
    }
    getCartById(id){
        return this.dao.getOne({_id: id})
    }
    updateCart(id, cart){
        return this.dao.update(id, cart)
    }
    deleteCart(id){
        return this.dao.delete(id)
    }
    getCartByOwner(id){
        return this.dao.getOne({userRelatedTo: id})
    }
}