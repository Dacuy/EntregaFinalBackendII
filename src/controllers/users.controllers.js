import { userService } from "../services/repositories.js";
import AuthService from "../services/AuthService.js";
import PresentUserDto from "../dto/user/PresentUserDto.js";
import CustomError from "../services/errors/CustomError.js";

const register = async (req, res, next) => {
    try {
        const { email, password, first_name, last_name, age } = req.body;

        if (!email || !password || !first_name || !last_name || !age) {
            throw new CustomError(400, 'Faltan campos requeridos');
        }

        const userExist = await userService.getUserByEmail(email);
        if (userExist) {
            throw new CustomError(409, 'El usuario ya existe');
        }

        const authService = new AuthService();
        const hashedPassword = await authService.hashPassword(password);

        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            age
        };

        const createdUser = await userService.createUser(user);
        res.status(201).json(new PresentUserDto(createdUser));
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new CustomError(400, 'Faltan campos requeridos');
        }

        const authService = new AuthService();
        const user = await authService.validateUser(email, password);

        const token = authService.signToken({ id: user._id, role: user.role });
        res.cookie('jwt', token, { httpOnly: true });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        next(error);
    }
};

const current = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);
        if (!user) {
            throw new CustomError(404, 'Usuario no encontrado');
        }
        res.json(new PresentUserDto(user));
    } catch (error) {
        next(error);
    }
};

export {
    register,
    login,
    current
};
