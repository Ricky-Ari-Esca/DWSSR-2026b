import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  let contador = 0;
  contador += 1;

  res.render('index', {
    title: 'Express',
    contador,
  });
});

export default router;
