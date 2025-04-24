const mongoose = require('mongoose');

// Usuarios
const usuarioSchema = new mongoose.Schema({
    idUsuario: {
        type: String,
        required: true,
    },
    nombreUsuario: {
        type: String,
        required: true,
    },
}, { _id: false });

// Transacciones
const transaccionSchema = new mongoose.Schema({
    idTransaccion: {
        type: String,
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
}, { _id: false });

// Retiros
const retirosSchema = new mongoose.Schema({
    idRetiro: {
        type: String,
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
}, { _id: false });

// Cierre de caja
const cierreSchema = new mongoose.Schema({
    idCaja: {
        type: Number,
        required: true,
    },
    idServicio: {
        type: Number,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    cantidadIncial: {
        type: Number,
    },
    cantidadFinal: {
        type: Number,
        required: true,
    },
    diferencia: {
        type: Number,
    },
    usuario: usuarioSchema,

}, { timestamps: true,
    versionKey: false
 });

 const CierreCaja = mongoose.model('CierreCaja', cierreSchema);
 module.exports = CierreCaja;