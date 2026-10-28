
import express from 'express';

const indexRouter = express.Router();

// Variables para llevar el contador
let counter = 0;
const numbers = [];

/* GET home page. */
indexRouter.get('/', (req, res, _next) => {
  // Incrementar el contador
  counter += 1;

  // Guardar el número actual
  numbers.push(counter);

  // Mostrar la página principal
  res.render('index', {
    title: 'Ricardo Arias Escárcega',
    counter,
    numbers,
  });
});

export default indexRouter;
