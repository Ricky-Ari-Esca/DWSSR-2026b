
import express from 'express';

const router = express.Router();

let counter = 0;
const numbers = [];

router.get('/', (req, res) => {
    counter++;
    numbers.push(counter);

    res.render('index', {
        title: 'Ricardo Arias Escárcega',
        counter: counter,
        numbers: numbers
    });
});

export default router;
