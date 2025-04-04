const mongoose = require ('mongoose');

const DevolucionSchema = new mongoose.Schema(
{
    idTransaccion: {
        type:String,
        required:true
    },
    monto: {
        type: Number,
        required:true
    },
    fecha:{
        type: Date,
        required: true 
    },
    noAutorizacion: {
        type: String,
        required:true
    }
}
)