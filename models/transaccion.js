const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const metodoPagoSchema = new mongoose.Schema({
    noTarjeta: {
        type: String
    },
    idMetodo: {
        type: Number,
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    correlativo: {
        type: String,
        required: true,
        unique: true
    },
    idBanco: {
        type: String
    }
});

const detalleSchema = new mongoose.Schema({
    producto: {
        type: String
    },
    cantidad: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    descuento: {
        type: Number
    },
    estado: {
        type: Number,
        default: 1
    }
});

const transaccionesSchema = new mongoose.Schema({
    noTransaccion: {
        type: Number,
        AutoIncrement: true
    },
    noAutorizacion: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    idCliente: {
        type: String
    },
    noFactura:{
        type: String
    },
    total: {
        type: Number,
        required: true
    },
    idCaja:{
        type: Number,
        required: true
    },
    servicioTransaccion: {
        type: Number,
        required: true
    },
    metodosPago:[metodoPagoSchema],
    detalle: [detalleSchema],
    estado: {
        type: Number,
        default: 1
    },
},  {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v; 
            return ret;
        }
    }
});

transaccionesSchema.plugin(AutoIncrement, { inc_field: 'noTransaccion' });

transaccionesSchema.statics.countByMetodoPago = async function (idMetodo) {
    return await this.countDocuments({ "metodosPago.idMetodo": idMetodo });
};

const Transaccion = mongoose.model('Transaccion', transaccionesSchema, 'transacciones');
module.exports = Transaccion;