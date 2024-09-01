import {productsService} from "../services/repositories.js"
import mongoose from 'mongoose';


const crearNuevoProd = async(req,res) =>{
    const {title, description, price, stock,category,restockData, image} = req.body
    if(!title || !description || !price || !stock || !category || !restockData || !image){
        res.status(400).send({status: 'error',error:'Valores incompletos'})
    }
    const newProduct = {
        title: title,
        description: description,
        price: price,
        stock: stock,
        category: category,
        image: image,
        restockData: restockData
    }

    const productExists = await productsService.getProductByName(title)
    if(!productExists){
        const result = await productsService.createProduct(newProduct)
        res.send({status: 'succes', payload: result})
    }else{
        res.status(200).send({status:'error', error:'Producto existente'})
    }
    
}
const updateProducto = async(req,res) => {
    const pid = req.params.pid;
    const {title, description, price, stock,category,restockData} = req.body
    if(!title || !description || !price || !stock || !category || !restockData){
        res.status(400).send({status: 'error',error:'Valores incompletos'})
    }
    const productoAupdatear = await productsService.getOneProduct(pid)
    if(!productoAupdatear){
        res.status(400).send({status: 'error',error:'Producto no existente'})
    }

    const productToUpdate = {
        title: title,
        description: description,
        price: price,
        stock: stock,
        category: category,
        restockData: restockData
    }
    const result = await productsService.updateProduct(pid, productToUpdate)
    res.send({status: 'succes', payload: result})
}
const borrarProducto = async(req,res) => {
    const pid = req.params.pid;
    const prodBorrar =  await productsService.getOneProduct(pid)
    if(!prodBorrar){
        res.status(400).send({status: 'error',error:'Producto no existente'})
    }
    const result = await productsService.deleteProduct(pid);
    res.send({status:'succes', payload:result})
}
const obtenerProductoPorId = async(req,res)=>{
    const pid = req.params.pid;
    const producto = await productsService.getOneProduct(pid)
    if(producto){
        res.send({status:'succes', payload: producto})
    }else{
        res.status(400).send({status: 'error',error:'Producto no relacionado con esa id'})
    }
}
const obtenerTodosProds = async(req,res) =>{
    const result = await productsService.getProducts()
    res.send({status:'succes', payload:result})
}
export default{
    crearNuevoProd,
    updateProducto,
    borrarProducto,
    obtenerProductoPorId,
    obtenerTodosProds
}