const mongoose = require('mongoose')
const empresa = require('../config/empresa')

const empresaSchema = new mongoose.Schema({
    nitEmpresa: {
        type: String,
        default: empresa.NitEmpresa
    },
    nombreEmpresa: {
        type: String,
        default: empresa.NombreEmpresa
    },
    telefonoEmpresa: {
        type: String,
        default: empresa.TelefonoEmpresa
    },
    direccionEmpresa: {
        type: String,
        default: empresa.DireccionEmpresa
    }
}, { _id: false })
const clienteSchema = new mongoose.Schema({
    idCliente: {
        type: String,
        default: null
    },
    nitCliente: {
        type: String,
        default: "CF"
    },
    nombreCliente: {
        type: String,
        default: "Consumidor"
    },
    apellidoCliente: {
        type: String, 
        default: "Final"
    },
    direccionCliente: {
        type: String,
        default: "Ciudad",
  
    }
}, { _id: false }) 
const detalleSchema = new mongoose.Schema({
    producto: {
        type: String,
        required: true
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
        type: Number,
        default: 0
    }
}, { _id: false })
const notaCreditoSchema = new mongoose.Schema({
    noNotaCredito: {
        type: String,
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
})
const facturaSchema = new mongoose.Schema({
    noFactura:{
        type: String,
        unique: true
    },
    serie: {
        type: String,
        default: "A001"
    },
    empresa: empresaSchema,
    fecha: {
        type: Date,
        default: Date.now
    },
    cliente: clienteSchema,
    detalle: [detalleSchema],
    notasCredito:[notaCreditoSchema],
    total: {
        type: Number,
        required: true
    },
    totalDescontado: {
        type: Number,
        default: 0
    },
    estado: {
        type: Number,
        default: 1,
    }

},
{
    timestamps: true, 
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v; 
            return ret;
        }
    }
}
)
const Factura = mongoose.model('Factura', facturaSchema,'facturas');
module.exports = Factura