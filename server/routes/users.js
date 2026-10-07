import express from 'express'

const router = express.Router()

// Ruta de usuarios
router.get('/', function (req, res) {

    res.send(`
        <h1>Usuarios</h1>
        <p>La ruta /users funciona correctamente.</p>
    `)

})

export default router