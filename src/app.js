import dotenv from 'dotenv'
import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import path from 'path';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import initializePassportConfig from './config/passport.config.js';
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
const app = express();
dotenv.config()

const PORT = process.env.APP_PORT || 8080;

const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

mongoose.connect(process.env.MONGO_URL);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassportConfig();
app.use(passport.initialize());

app.use(cookieParser());
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

