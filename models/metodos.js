const mongoose = require('mongoose');

const metodoPagoSchema = new mongoose.Schema({
    metodo: {
        type: String,
        required: true,
        enum: ['efectivo', 'tarjeta de credito', 'tarjeta de debito', 'tarjeta de fidelidad'], 
        trim: true
    },
    estado: {
        type: Number,  
        enum: [0, 1],  
        required: true,
        default: 1      
    },
    createdAt: {
        type: Date,
        default: Date.now  
    },
    updatedAt: {
        type: Date,
        default: Date.now  
    }
});

metodoPagoSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Crear el modelo
const MetodoPago = mongoose.model('MetodoPago', metodoPagoSchema);

module.exports = MetodoPago;
