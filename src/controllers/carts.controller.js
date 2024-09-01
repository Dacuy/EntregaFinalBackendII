import { cartsService, productsService, ticketService, userService } from "../services/repositories.js";
import mongoose from 'mongoose';
import AuthService from "../services/AuthService.js";
import { v4 as uuidv4 } from 'uuid';
import MailingService from '../services/MailingServices.js';

const verificarPropietarioCarrito = async (req, res, cartId) => {
    const authService = new AuthService();
    const token = req.headers.authorization.split(' ')[1];
    const tokenData = await authService.verifyToken(token);

    const carrito = await cartsService.getCartById(cartId);
    if (!carrito) {
        res.status(404).send('Carrito no encontrado');
        return null; // Importante: devolver null si no se encuentra el carrito
    }

    if (tokenData.id !== carrito.userRelatedTo) {
        res.status(403).send('No tienes permiso para modificar este carrito');
        return null; // Importante: devolver null si no tiene permiso
    }

    return carrito;
};

const crearCarrito = async (req, res) => {
    const authService = new AuthService();
    if (!req.headers.authorization) {
        return res.status(401).send({status: 'error', error: 'Authorization header missing'});
    }

    const token = req.headers.authorization.split(' ')[1];
    const tokenData = await authService.verifyToken(token);
    const { products = [] } = req.body;
    const userRelatedTo = tokenData.id;
    
    const cartOwnerHasOne = await cartsService.getCartByOwner(userRelatedTo);
    try {
        if(!cartOwnerHasOne){
            await cartsService.createCart({ products , userRelatedTo });
            res.status(201).send(products.length ? 'Carrito ha sido creado con productos' : 'Carrito ha sido creado vacío');
        } else {
            res.status(400).send({status: 'error', error: 'Ya tienes un carrito creado'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const buscarCarritoPorId = async (req, res) => {
    const { cid: cartId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).send('ID de carrito no es válido');
    }
    try {
        const cartExistente = await cartsService.getCartById(cartId);
        if (cartExistente) {
            res.send(cartExistente);
        } else {
            res.status(404).send(`El carrito con id ${cartId} no existe`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const subirProdAelCarrito = async (req, res) => {
    const { cid: cartId, pid: idProd } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(idProd)) {
        return res.status(400).send('ID de carrito o producto no es válido');
    }
    try {
        const carrito = await verificarPropietarioCarrito(req, res, cartId);
        if (!carrito) return;

        const producto = await productsService.getOneProduct(idProd);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        const productoEnCarrito = carrito.products.find(prod => prod.id.equals(idProd));
        if (productoEnCarrito) {
            productoEnCarrito.quantity += 1;
        } else {
            carrito.products.push({ id: idProd, quantity: 1 });
        }

        await cartsService.updateCart(cartId, carrito);
        res.status(200).send('Producto agregado al carrito exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const borrarProductoDelCarrito = async (req, res) => {
    const { cid: cartId, pid: productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send('ID de carrito o producto no es válido');
    }
    try {
        const carrito = await verificarPropietarioCarrito(req, res, cartId);
        if (!carrito) return;

        // Verificar si carrito.products está definido
        if (!Array.isArray(carrito.products)) {
            return res.status(500).send('El carrito no contiene productos.');
        }

        carrito.products = carrito.products.filter(product => !product.id.equals(productId));
        await cartsService.updateCart(cartId, carrito);
        res.send('Producto eliminado del carrito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const actualizarCarrito = async (req, res) => {
    const { cid: cartId } = req.params;
    const { products } = req.body;
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).send('ID de carrito no es válido');
    }
    try {
        const carrito = await verificarPropietarioCarrito(req, res, cartId);
        if (!carrito) return;

        carrito.products = products;
        await cartsService.updateCart(cartId, carrito);
        res.send('Carrito actualizado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const cantidadProducto = async (req, res) => {
    const { cid: cartId, pid: productId } = req.params;
    const { quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send('ID de carrito o producto no es válido');
    }
    try {
        const carrito = await verificarPropietarioCarrito(req, res, cartId);
        if (!carrito) return;

        const productoEnCarrito = carrito.products.find(prod => prod.id.equals(productId));
        if (productoEnCarrito) {
            productoEnCarrito.quantity = quantity;
            await cartsService.updateCart(cartId, carrito);
            res.send('Cantidad de producto actualizada con éxito');
        } else {
            res.status(404).send('Producto no encontrado en el carrito');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const borrarCarritoCompleto = async (req, res) => {
    const { cid: cartId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).send('ID de carrito no es válido');
    }
    try {
        const carrito = await verificarPropietarioCarrito(req, res, cartId);
        if (!carrito) return;

        await cartsService.deleteCart(cartId);
        res.send('Carrito eliminado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const terminarDeComprar = async (req, res) => {
    const { cid: cartId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).send('ID de carrito no es válido');
    }

    try {
        const carrito = await verificarPropietarioCarrito(req, res, cartId);
        if (!carrito) return;

        const productos = carrito.products;
        if (productos.length === 0) {
            return res.status(400).send('El carrito está vacío');
        }

        const productosSinStock = [];
        const productosComprados = [];
        let totalCompra = 0;

        const usuario = await userService.getUserById(carrito.userRelatedTo);
        const userEmail = usuario.email;
        const userFirstName = usuario.first_name;
        const userLastName = usuario.last_name;

        for (let item of productos) {
            const productoDb = await productsService.getOneProduct(item.id);

            if (productoDb) {
                if (productoDb.stock < item.quantity) {
                    productosSinStock.push({
                        id: item.id,
                        name: productoDb.title,
                        image: productoDb.image,
                        price: productoDb.price,
                        quantity: item.quantity,
                    });
                } else {
                    productoDb.stock -= item.quantity;
                    await productoDb.save();
                    totalCompra += productoDb.price * item.quantity;
                    productosComprados.push({
                        id: item.id,
                        name: productoDb.title,
                        image: productoDb.image,
                        quantity: item.quantity,
                        price: productoDb.price,
                    });
                }
            } else {
                console.log(`Producto con ID ${item.id} no encontrado en la base de datos`);
                productosSinStock.push({
                    id: item.id,
                    name: `ID: ${item.id} (no encontrado)`,
                    quantity: item.quantity,
                });
            }
        }

        if (totalCompra > 0) {
            const codigoOrden = uuidv4();
            const timeStamp = Date.now();

            const newTicket = {
                code: codigoOrden,
                purchase_datetime: timeStamp,
                amount: totalCompra,
                purchaser: userEmail
            };

            const result = await ticketService.createTicket(newTicket);

            carrito.products = productosSinStock;
            await cartsService.updateCart(cartId, carrito);

            const mailingService = new MailingService();
            const mailResult = mailingService.sendMail({
                from: 'BackEndEntregaFinalII <noreply@backendentregafinal.com>',
                to: userEmail,
                subject: `Resumen de su compra`,
                html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Ticket de Compra</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                        }
                        .container {
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            padding: 20px;
                            max-width: 500px;
                            width: 100%;
                            margin: 20px;
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .logo img {
                            max-width: 150px;
                        }
                        .ticket-info {
                            border-bottom: 1px solid #e0e0e0;
                            padding-bottom: 15px;
                            margin-bottom: 15px;
                        }
                        .ticket-info p {
                            margin: 0;
                            font-size: 16px;
                        }
                        .product-list, .out-of-stock-list {
                            margin-bottom: 15px;
                        }
                        .product-list h3, .out-of-stock-list h3 {
                            font-size: 18px;
                            margin-bottom: 10px;
                        }
                        .product-item, .out-of-stock-item {
                            background-color: #f9f9f9;
                            border: 1px solid #e0e0e0;
                            border-radius: 5px;
                            padding: 10px;
                            margin-bottom: 5px;
                            display: flex;
                            align-items: center;
                        }
                        .product-item img, .out-of-stock-item img {
                            max-width: 50px;
                            margin-right: 10px;
                        }
                    </style>
                </head>
                <body>

                <div class="container">
                    <h1>Gracias por tu compra ${userFirstName}!</h1>
                    <!-- Logo -->
                    <div class="logo">
                        <img src="cid:logo" alt="Logo">
                    </div>

                    <div class="ticket-info">
                        <p><strong>NRO de orden:</strong> <span>${codigoOrden}</span></p>
                        <p><strong>Fecha y hora de la compra:</strong> <span>${new Date(timeStamp).toLocaleString()}</span></p>
                        <p><strong>Cantidad total con IVA:</strong> <span>$ ${totalCompra}</span></p>
                        <p><strong>Nombre del comprador:</strong> <span>${userFirstName} ${userLastName}</span></p>
                    </div>

                    <div class="product-list">
                        <h3>Productos Comprados</h3>
                        ${productosComprados.map(item => `
                            <div class="product-item">
                                <img src="${item.image}" alt="${item.name}"/> <!-- Aquí se usa la imagen del producto -->
                                <div>
                                    <p><strong>Producto:</strong> ${item.name}</p>
                                    <p><strong>Cantidad:</strong> ${item.quantity}</p>
                                    <p><strong>Precio Unitario:</strong> $${item.price}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Lista de productos sin stock -->
                    ${productosSinStock.length > 0 ? `
                    <div class="out-of-stock-list">
                        <h3>Productos Sin Stock</h3>
                        <p>No se te han cobrado</p>
                        ${productosSinStock.map(item => `
                            <div class="out-of-stock-item">
                                ${item.image ? `<img src="${item.image}" alt="${item.name}"/>` : ''}
                                <div>
                                    <p><strong>Producto:</strong> ${item.name}</p>
                                    <p><strong>Cantidad Solicitada:</strong> ${item.quantity}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>

                </body>
                </html>
                `,
                attachments: [{
                    filename: 'logo.png',
                    path: './src/assets/logoNode.png',
                    cid: 'logo'
                }]
            });

            res.status(200).json({
                status: 'Success',
                ticket: result,
                productosSinStock: productosSinStock.map(prod => prod.id),
                totalCompra: totalCompra
            });
        } else {
            res.status(200).json({
                message: 'No se pudo procesar la compra. Algunos productos no tenían suficiente stock',
                productosSinStock: productosSinStock.map(prod => prod.id),
                totalCompra: 0
            });
        }
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ error: 'Error al finalizar la compra', details: error.message });
    }
};

export default {
    crearCarrito,
    buscarCarritoPorId,
    subirProdAelCarrito,
    borrarProductoDelCarrito,
    actualizarCarrito,
    cantidadProducto,
    borrarCarritoCompleto,
    terminarDeComprar
};
