// auth.mjs
import passport from 'passport';
import localStrategy from './localStrategy.mjs';
import jwtStrategy from './jwtStrategy.mjs';

passport.use(localStrategy);
passport.use(jwtStrategy);

export default passport;