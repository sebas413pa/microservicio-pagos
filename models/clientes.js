const mongoose = require('mongoose');

const tarjetaFidelidadSchema = new mongoose.Schema({
    noTarjeta: {
        type: String
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
    estado: {
        type: Number,
        default: 1,
    }
}, {
    timestamps: true, 
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v; 
            return ret;
        }
    }
});

const Cliente = mongoose.model('Cliente', clienteSchema, 'clientes');
module.exports = Cliente;
