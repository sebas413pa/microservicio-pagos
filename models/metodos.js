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
}, { timestamps: true });

const MetodoPago = mongoose.model('MetodoPago', metodoPagoSchema);

module.exports = MetodoPago;
