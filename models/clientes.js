const mongoose = require('mongoose');


//Tarjeta de fidelidad
const tarjetaFidelidadSchema = new mongoose.Schema({
    noTarjeta: {
        type: String,
        required: true,
        unique: true
    },
    cantidadPuntos: {
        type: Number,
        default: 0,
    },
    fechaExpiracion: {
        type: Date,
        required: true,
    },
    estado: {
        type: Number,
        default: 1,
    },
});

// Cliente
const clienteSchema = new mongoose.Schema({
    nombreCliente: {
        type: String,
        required: true,
    },
    apellidosCliente: {
        type: String,
        required: true,
    },
    nit: {
        type: String,
        required: true,
        unique: true,
    },
    tarjetaFidelidad: [tarjetaFidelidadSchema], 
    direccion: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dpi: {
        type: String,
        required: true,
        unique: true,
    },
    compras: [Number], 
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo',
    }
}, {
    timestamps: true, 
});

const Cliente = mongoose.model('Cliente', clienteSchema, 'clientes');
module.exports = Cliente;
