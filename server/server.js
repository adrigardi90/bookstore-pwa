// To solve ReferenceError: regeneratorRuntime is not defined when we use async/await with Parcel
import 'babel-polyfill';

const Hapi = require('hapi');
import { BOOKS_ROUTES } from './routes/books';
import { SUB_ROUTES } from './routes/subscriptions';


// Server 
const server = Hapi.server({
  host: 'localhost',
  port: 3000,
  routes: {
    cors: true,
  }
});


// Books API
server.route(BOOKS_ROUTES.GET);
server.route(BOOKS_ROUTES.POST);

// Subscriptions API
server.route(SUB_ROUTES.POST);


// Start the server  
async function start() {

  try {
    await server.start();
  }
  catch (err) {
    console.log('[SERVER] Error: ', err);
    process.exit(1);
  }

  console.log('[SERVER] Server running at:', server.info.uri);
};

start();