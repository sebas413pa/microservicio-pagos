const mongoose = require('mongoose');

const metodoPagoSchema = new mongoose.Schema({
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
    }
}, { 
    timestamps: true  
});

metodoPagoSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Crear el modelo
const MetodoPago = mongoose.model('MetodoPago', metodoPagoSchema);

module.exports = MetodoPago;
