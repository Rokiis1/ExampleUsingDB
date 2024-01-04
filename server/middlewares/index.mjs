import express from 'express';
import cors from 'cors';

const setupMiddleware = (app) => {
  // express.json() is a built-in middleware function in Express
  // .use is a method in Express that mounts the specified middleware function or functions at the specified path
  // it parses incoming requests with JSON payloads and is based on body-parser
  // what is body parser? - https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
  app.use(express.json());
  // express.urlencoded() is a built-in middleware function in Express that parses incoming requests with urlencoded payloads
  // it is based on body-parser and is used to parse incoming requests with urlencoded payloads
  app.use(express.urlencoded({ extended: true}));
  // cors() is a built-in middleware function in Express
  // it allows us to make requests to our server from a different origin
  app.use(cors());
};
  
export default setupMiddleware;