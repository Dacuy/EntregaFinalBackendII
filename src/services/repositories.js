//USUARIOS
import UsersDao from "../db/dao/UsersDao.js";
import UserRepository from "../repositories/UserRepository.js";
//PRODUCTOS
import ProductsDao from "../db/dao/ProductsDao.js";
import ProductsRepository from "../repositories/ProductsRepository.js";
//CARRITOS
import CartsDao from "../db/dao/CartsDao.js"
import CartsRepository from "../repositories/CartsRepository.js";
//TICKETS
import TicketDao from '../db/dao/TicketDao.js'
import TicketsRepository from "../repositories/TicketRepository.js";



//users
export const userService = new UserRepository(new UsersDao())
//productos
export const productsService = new ProductsRepository(new ProductsDao())
//carritos
export const cartsService = new CartsRepository(new CartsDao())
//TICKETS
export const ticketService = new TicketsRepository(new TicketDao())
