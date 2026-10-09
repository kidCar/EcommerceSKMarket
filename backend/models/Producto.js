const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [1, 'El nombre no puede estar vacío']
  },
  descripcion: {
    type: String,
    trim: true,
    default: ''
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
    validate: {
      validator: Number.isFinite,
      message: 'El precio debe ser un número finito'
    }
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [0, 'La cantidad no puede ser negativa'],
    validate: {
      validator: Number.isInteger,
      message: 'La cantidad debe ser un número entero'
    }
  }
}, {
  versionKey: false,
  toJSON: {
    transform: (_document, producto) => {
      producto.id = producto._id.toString();
      delete producto._id;
      return producto;
    }
  }
});

module.exports = mongoose.model('Producto', productoSchema);
