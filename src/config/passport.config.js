import passport from 'passport';
import local from 'passport-local';
import { userService } from "../services/repositories.js";
import AuthService from "../services/AuthService.js";
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import PresentUserDto from '../dto/user/PresentUserDto.js';

const LocalStrategy = local.Strategy;

const initializePassportConfig = () => {
    passport.use('register', new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, age } = req.body;
                if (!first_name || !last_name || !age) {
                    return done(null, false, { message: 'Incomplete Values' });
                }

                const user = await userService.getUserByEmail(email);
                if (user) {
                    return done(null, false, { message: 'User already exists' });
                }

                const authService = new AuthService();
                const hashedPassword = await authService.hashPassword(password);
                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email,
                    password: hashedPassword
                };

                const result = await userService.createUser(newUser);
                return done(null, result);

            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userService.getUserByEmail(email);
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const authService = new AuthService();
                const isMatch = await authService.comparePassword(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const token = authService.signToken({ id: user._id, role: user.role });
                return done(null, { user, token });

            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('current', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
            secretOrKey: 'secretito'
        },
        async (jwtPayload, done) => {
            try {
                const user = await userService.getUserById(jwtPayload.id).select('-password');
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const parsedUser = new PresentUserDto(user);
                return done(null, parsedUser);
            } catch (err) {
                return done(err, false);
            }
        }
    ));
    
};

export default initializePassportConfig;
