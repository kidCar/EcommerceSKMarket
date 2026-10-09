
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let productos = [
  { id: 1, nombre: 'Teclado', precio: 350 },
  { id: 2, nombre: 'Mouse', precio: 200 }
];

let siguienteId = 3;

// READ: consultar productos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// CREATE: crear producto
app.post('/api/productos', (req, res) => {
  const { nombre, precio } = req.body;

  if (!nombre || typeof precio !== 'number' || precio < 0) {
    return res.status(400).json({
      mensaje: 'Nombre y precio válido son obligatorios'
    });
  }

  const nuevo = { id: siguienteId++, nombre, precio };
  productos.push(nuevo);

  res.status(201).json(nuevo);
});

// UPDATE: actualizar producto
app.put('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = productos.findIndex(p => p.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: 'Producto no encontrado'
    });
  }

  const { nombre, precio } = req.body;

  if (!nombre || typeof precio !== 'number' || precio < 0) {
    return res.status(400).json({
      mensaje: 'Nombre y precio válido son obligatorios'
    });
  }

  productos[indice] = { id, nombre, precio };
  res.json(productos[indice]);
});

// DELETE: eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const cantidadAnterior = productos.length;

  productos = productos.filter(p => p.id !== id);

  if (productos.length === cantidadAnterior) {
    return res.status(404).json({
      mensaje: 'Producto no encontrado'
    });
  }

  res.status(204).end();
});

app.listen(3000, () => {
  console.log('API disponible en http://localhost:3000');
});