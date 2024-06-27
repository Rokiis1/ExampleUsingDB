// We need the auth.mjs file to set up the authentication strategies for the server. The auth.mjs file contains the passport object, which is used to set up the authentication strategies for the server. The passport object is initialized with the local strategy and the JWT strategy. The local strategy is used to authenticate users using a username and password, while the JWT strategy is used to authenticate users using a JSON Web Token (JWT). By setting up the authentication strategies in the auth.mjs file, we can easily configure the server to authenticate users using different methods. This allows us to secure the server routes and restrict access to certain endpoints based on the user's authentication status.

import passport from 'passport';
import localStrategy from './localStrategy.mjs';
import createJwtStrategy from './jwtStrategy.mjs';

// Initialize passport with the local and JWT strategies. We will use these strategies to authenticate users using a username and password or a JSON Web Token (JWT).
const initializePassport = async () => {
  passport.use(localStrategy);
  const jwtStrategy = await createJwtStrategy();
  passport.use(jwtStrategy);
};

initializePassport();

export default passport;
