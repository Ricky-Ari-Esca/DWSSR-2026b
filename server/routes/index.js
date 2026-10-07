import express from 'express'

const router = express.Router()

// Página principal
router.get('/', function (req, res) {

    res.render('index', {
        title: 'DWSSR-2026b'
    })

})

export default router