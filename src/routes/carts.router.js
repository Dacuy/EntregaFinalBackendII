import { Router } from "express";
import cartsController from '../controllers/carts.controller.js';
import checkRoleAuth from '../middlewares/roleAuth.js'
import passport from "passport";
const router = Router()

router.post('/createCart',passport.authenticate('current', { session: false }),checkRoleAuth('user', 'admin')  ,cartsController.crearCarrito);
router.get('/:cid',passport.authenticate('current', { session: false }),checkRoleAuth('user', 'admin'),cartsController.buscarCarritoPorId)
router.post('/:cid/product/:pid',passport.authenticate('current', { session: false }),checkRoleAuth('user', 'admin'),cartsController.subirProdAelCarrito)
router.delete('/:cid/product/:pid', passport.authenticate('current', { session: false }),checkRoleAuth('user', 'admin'),cartsController.borrarProductoDelCarrito)
router.put('/:cid', passport.authenticate('current', { session: false }),checkRoleAuth('user', 'admin'),cartsController.actualizarCarrito)
router.put('/:cid/products/:pid', passport.authenticate('current', { session: false }),checkRoleAuth('user', 'admin'),cartsController.cantidadProducto)
router.delete('/:cid', passport.authenticate('current', { session: false }),checkRoleAuth('user', 'admin'),cartsController.borrarCarritoCompleto)
router.post('/:cid/purchase', passport.authenticate('current', { session: false }),checkRoleAuth('user', 'admin'),cartsController.terminarDeComprar)


export default router;