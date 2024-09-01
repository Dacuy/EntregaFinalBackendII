import { Router } from "express";
import passport from "passport";
const sessionsRouter = Router();

sessionsRouter.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).send({ message: info.message });
        }
        res.send({ status: "success", message: "Registered", user });
    })(req, res, next);
});

sessionsRouter.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, data, info) => {
        if (err) {
            return next(err);
        }
        if (!data) {
            return res.status(400).send({ message: info.message });
        }
        const { user, token } = data;
        res.cookie('jwt', token, { httpOnly: true });
        res.send({ status: "success", message: "Logged in", user });
    })(req, res, next);
});

sessionsRouter.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.send({ user: req.user });
});

sessionsRouter.get('/registerFail', (req, res) => {
    console.log("Algo salio mal");
    res.send("error");
});

export default sessionsRouter;
