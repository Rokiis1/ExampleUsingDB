// localhosy strategy for passport authentication. We will use this strategy to authenticate users using a username and password.

// Import the bcrypt library to compare the password hash with the user's password hash. We will use this library to compare the password hash with the user's password hash.
import bcrypt from 'bcrypt';

// Import the LocalStrategy from the passport-local package. We will use this strategy to authenticate users using a username and password.
import { Strategy as LocalStrategy } from 'passport-local';

// Import the userModel from the user model file. We will use this model to interact with the user data in the database.
import userModel from '../models/userModel.mjs';

// Define the localStrategy for passport authentication. We will use this strategy to authenticate users using a username and password.
const localStrategy = new LocalStrategy(
  {
    // Define the fields for the username and password in the request body. We will use these fields to extract the username and password from the request body.
    usernameField: 'login',
    passwordField: 'password',
  },
  // Define the callback function for the local strategy. This function will be called when a user tries to authenticate using the local strategy.
  // done is a callback function that should be called with the user object if the authentication is successful or false if the authentication fails.
  async (login, password, done) => {
    // Try to find the user by the username or email in the database. We will use the login field to find the user by the username or email.
    try {
      // Find the user by the username or email in the database using the login method from the userModel.
      const user = await userModel.login({ username: login, email: login });
      // If the user is not found, return an error message.
      const match = await bcrypt.compare(password, user.password);

      // Compare the password hash with the user's password hash using the bcrypt.compare method. We will use this method to compare the password hash with the user's password hash.
      if (!match) {
        // If the password hash does not match, return an error message.
        //  null is the error object, false is the user object, and an object with the message property is the error message.
        return done(null, false, { message: 'Invalid credentials.' });
      }
      // If the password hash does not match, return an error message. If the password hash matches, return the user object.
      // If the user is found, return the user object. We will use the user object to authenticate the user.
      //  null is the error object, user is the user object, and null is the info object.
      return done(null, user);
      // If an error occurs during the authentication process, return the error.
    } catch (error) {
      {
        // If the user is not found, return an error message. If an error occurs during the authentication process, return the error.
        if (error.message === 'User not found.') {
          return done(null, false, { message: error.message });
        }
        return done(error);
      }
    }
  },
);

export default localStrategy;
