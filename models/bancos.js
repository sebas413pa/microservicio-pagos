const mongoose = require ('mongoose');

const transaccionesSchema = new mongoose.Schema({
    noTransaccion: {
        type: mongoose.Schema.Types.ObjectId,
    },
    metodosDePago: {
        correlativo: {
            type: String,
        },
        idMetodo: {
            type: Number
        },
        monto: {
            type: Number,
            default: 0.00
        }
    }
}, { _id: false })
const BancoSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: true
    },
    totalTransacciones: {
        type: Number,
        default:0,
    },
    transacciones: [transaccionesSchema],
    estado: {
        type: Number,
        default: 1
    },
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
);

BancoSchema.statics.getNombreById = async function (idBanco) {
    return await this.findById(idBanco).select('nombre totalTransacciones');
};

module.exports = mongoose.model('bancos', BancoSchema);