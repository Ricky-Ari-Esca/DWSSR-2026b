#!/usr/bin/env node

// Importar HTTP
import http from 'node:http'

// Importar aplicación Express
import app from '../app.js'

// --------------------------------------------------
// CONFIGURACIÓN DEL PUERTO
// --------------------------------------------------

const port = normalizePort(
    process.env.PORT || '3000'
)

app.set('port', port)

// --------------------------------------------------
// CREAR SERVIDOR
// --------------------------------------------------

const server = http.createServer(app)

// --------------------------------------------------
// INICIAR SERVIDOR
// --------------------------------------------------

server.listen(port)

server.on('error', onError)

server.on('listening', onListening)

// --------------------------------------------------
// NORMALIZAR PUERTO
// --------------------------------------------------

function normalizePort(val) {

    const port = parseInt(val, 10)

    if (Number.isNaN(port)) {

        return val
    }

    if (port >= 0) {

        return port
    }

    return false
}

// --------------------------------------------------
// MANEJAR ERROR
// --------------------------------------------------

function onError(error) {

    if (error.syscall !== 'listen') {

        throw error
    }

    const bind =
        typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port

    switch (error.code) {

        case 'EACCES':

            console.error(
                `${bind} requiere privilegios elevados.`
            )

            process.exit(1)

            break

        case 'EADDRINUSE':

            console.error(
                `${bind} ya está siendo utilizado.`
            )

            process.exit(1)

            break

        default:

            throw error
    }
}

// --------------------------------------------------
// SERVIDOR LISTO
// --------------------------------------------------

function onListening() {

    const addr = server.address()

    const bind =
        typeof addr === 'string'
            ? `pipe ${addr}`
            : `http://localhost:${addr.port}`

    console.log('')
    console.log('======================================')
    console.log('🚀 Servidor iniciado correctamente')
    console.log(`🌐 ${bind}`)
    console.log('======================================')
    console.log('')
}