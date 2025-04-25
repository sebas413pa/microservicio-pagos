const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const transaccionesSchema = new mongoose.Schema({
    noTransaccion: {
        type: String
    },
    correlativo: {
        type: String,
    },
    idBanco: {
        type: String,
        default: null
    },
    noTarjeta: {
        type: String,
        default: null
    },
    monto: {
        type: Number,
        default: 0.00
    },
    nitCliente: {
        type: String, 
        default: null   
    }
}, { _id: false })

const metodoPagoSchema = new mongoose.Schema({
    noMetodo: {
        type: Number,
        AutoIncrement: true
    },
    metodo: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: Number,  
        enum: [0, 1],  
        required: true,
        default: 1
    },
    transacciones:[transaccionesSchema]
}, { 
    timestamps: true  
});

metodoPagoSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});
metodoPagoSchema.plugin(AutoIncrement, { inc_field: 'noMetodo' });
// Crear el modelo
const MetodoPago = mongoose.model('MetodoPago', metodoPagoSchema);

module.exports = MetodoPago;
