export default class ProductsRepository {
    constructor(dao){
        this.dao = dao;
    }
    getProducts(){
        return this.dao.get()
    }
    getOneProduct(id){
        return this.dao.getOne({_id: id})
    }
    getProductByName(name){
        return this.dao.getOne({title: name})
    }
    deleteProduct(id){
        return this.dao.delete(id)
    }
    updateProduct(id, product){
        return this.dao.update(id, product)
    }
    createProduct(product){
        return this.dao.create(product)
    }
}