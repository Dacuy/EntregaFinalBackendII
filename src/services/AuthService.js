import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
    hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    comparePassword(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    }

    signToken(payload) {
        return jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: '1h' });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_TOKEN);
        } catch (err) {
            return null;
        }
    }
}

export default AuthService;
