
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDatabase = require('./config/db');
const Producto = require('./models/Producto');

const app = express();
app.use(cors());
app.use(express.json());

function validarProducto(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'El cuerpo de la solicitud debe ser un objeto JSON' };
  }

  const camposPermitidos = ['nombre', 'descripcion', 'precio', 'cantidad'];
  if (Object.keys(body).some(campo => !camposPermitidos.includes(campo))) {
    return { error: 'El producto contiene campos no permitidos' };
  }

  const { nombre, descripcion, precio, cantidad } = body;

  if (typeof nombre !== 'string' || nombre.trim().length === 0) {
    return { error: 'El nombre es obligatorio y no puede estar vacío' };
  }

  if (descripcion !== undefined && typeof descripcion !== 'string') {
    return { error: 'La descripción debe ser texto' };
  }

  if (typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
    return { error: 'El precio debe ser un número finito no negativo' };
  }

  if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad < 0) {
    return { error: 'La cantidad debe ser un número entero no negativo' };
  }

  return {
    datos: {
      nombre: nombre.trim(),
      descripcion: descripcion === undefined ? '' : descripcion.trim(),
      precio,
      cantidad
    }
  };
}

function validarId(id, res) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ mensaje: 'El ID del producto no es válido' });
    return false;
  }

  return true;
}

app.get('/api/productos', async (_req, res) => {
  const productos = await Producto.find().sort({ _id: 1 });
  res.json(productos);
});

app.get('/api/productos/:id', async (req, res) => {
  if (!validarId(req.params.id, res)) {
    return;
  }

  const producto = await Producto.findById(req.params.id);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  res.json(producto);
});

app.post('/api/productos', async (req, res) => {
  const resultado = validarProducto(req.body);
  if (resultado.error) {
    return res.status(400).json({ mensaje: resultado.error });
  }

  const producto = await Producto.create(resultado.datos);
  res.status(201).json(producto);
});

app.put('/api/productos/:id', async (req, res) => {
  if (!validarId(req.params.id, res)) {
    return;
  }

  const resultado = validarProducto(req.body);
  if (resultado.error) {
    return res.status(400).json({ mensaje: resultado.error });
  }

  const producto = await Producto.findById(req.params.id);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  producto.set(resultado.datos);
  await producto.save();
  res.json(producto);
});

app.delete('/api/productos/:id', async (req, res) => {
  if (!validarId(req.params.id, res)) {
    return;
  }

  const producto = await Producto.findByIdAndDelete(req.params.id);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && Object.hasOwn(error, 'body')) {
    return res.status(400).json({ mensaje: 'El cuerpo de la solicitud contiene JSON inválido' });
  }

  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ mensaje: 'Los datos del producto no son válidos' });
  }

  console.error('Error en la API:', error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
});

async function iniciarServidor() {
  try {
    await connectDatabase();
    const puerto = process.env.PORT || 3000;
    app.listen(puerto, () => {
      console.log(`API disponible en http://localhost:${puerto}`);
    });
  } catch (error) {
    console.error('No se pudo conectar con MongoDB:', error);
    process.exitCode = 1;
  }
}

iniciarServidor();