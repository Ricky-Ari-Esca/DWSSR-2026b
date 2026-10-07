// Manejo de errores
import createError from 'http-errors'

// Framework Express
import express from 'express'

// Manejo de rutas
import path from 'node:path'

// Manejo de cookies
import cookieParser from 'cookie-parser'

// Logger
import logger from 'morgan'

// Debug
import createDebug from 'debug'

// Crear __dirname en ES Modules
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// Handlebars
import hbs from 'hbs'

// Rutas
import indexRouter from '#routes/index.js'
import usersRouter from '#routes/users.js'

// Helper de Vite
import { registerViteHelper } from './lib/vite.js'

// --------------------------------------------------
// CONFIGURACIÓN
// --------------------------------------------------

const debug = createDebug('dwssr-2026b:server')

// Crear rutas del archivo actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// --------------------------------------------------
// CREAR APLICACIÓN
// --------------------------------------------------

debug('🔨 Creando backend')

const app = express()

// --------------------------------------------------
// HANDLEBARS
// --------------------------------------------------

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// Registrar helper de Vite
registerViteHelper(hbs)

// --------------------------------------------------
// MIDDLEWARES
// --------------------------------------------------

app.use(logger('dev'))

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

app.use(cookieParser())

// --------------------------------------------------
// ARCHIVOS ESTÁTICOS DE PRODUCCIÓN
// --------------------------------------------------

if (process.env.NODE_ENV === 'production') {

    debug('📦 Modo producción')

    app.use(
        express.static(
            path.join(__dirname, '..', 'dist')
        )
    )
}

// --------------------------------------------------
// ARCHIVOS PÚBLICOS
// --------------------------------------------------

debug('📁 Configurando archivos estáticos')

app.use(
    express.static(
        path.join(__dirname, '..', 'public')
    )
)

// --------------------------------------------------
// RUTAS
// --------------------------------------------------

debug('🛣️ Registrando rutas')

app.use('/', indexRouter)

app.use('/users', usersRouter)

// --------------------------------------------------
// ERROR 404
// --------------------------------------------------

app.use(function (req, res, next) {

    next(createError(404))

})

// --------------------------------------------------
// MANEJADOR DE ERRORES
// --------------------------------------------------

app.use(function (err, req, res, next) {

    res.locals.message = err.message

    res.locals.error =
        req.app.get('env') === 'development'
            ? err
            : {}

    res.status(err.status || 500)

    res.render('error')

})

// --------------------------------------------------
// EXPORTAR
// --------------------------------------------------

export default app