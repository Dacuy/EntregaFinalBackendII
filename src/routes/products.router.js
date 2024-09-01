import { Router } from "express";
import productsController from '../controllers/products.controllers.js'
import checkRoleAuth from '../middlewares/roleAuth.js'
import passport from "passport";
const router = Router()


router.post('/newProduct', passport.authenticate('current', { session: false }),checkRoleAuth('admin'), productsController.crearNuevoProd);
router.post('/updateProduct/:pid', passport.authenticate('current', { session: false }),checkRoleAuth('admin') , productsController.updateProducto);
router.delete('/deleteProduct/:pid', passport.authenticate('current', { session: false }),checkRoleAuth('admin') ,productsController.borrarProducto);


router.get('/:pid', productsController.obtenerProductoPorId)
router.get('/', productsController.obtenerTodosProds)


export default router;