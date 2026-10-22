// Manejo de errores

// Framework Express

// Manejo de rutas y directorios
import path from "node:path";
import { fileURLToPath } from "node:url";

// Middlewares
import cookieParser from "cookie-parser";

// Depuración
import createDebug from "debug";
import express from "express";

// Motor de plantillas Handlebars
import hbs from "hbs";
import createError from "http-errors";
import logger from "morgan";

// Rutas de la aplicación
import indexRouter from "#routes/index.js";
import usersRouter from "#routes/users.js";

// Helper para Vite
import { registerViteHelper } from "./lib/vite.js";

// Configuración de rutas del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancia de Debug
const debug = createDebug("dwssr-2026b:server");

// Crear aplicación Express
debug("Creando backend");

const app = express();

// Configurar Handlebars
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Registrar helper de Vite
registerViteHelper(hbs);

// Configurar middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Servir archivos compilados en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "dist")));
}

// Servir archivos estáticos públicos
debug("Creando servidor de archivos estáticos");

app.use(express.static(path.join(__dirname, "..", "public")));

// Registrar rutas
debug("Registrando rutas");

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Manejar rutas inexistentes (404)
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador centralizado de errores
app.use((err, req, res, _next) => {
  res.locals.message = err.message;

  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);

  res.render("error");
});

// Exportar la aplicación
export default app;
