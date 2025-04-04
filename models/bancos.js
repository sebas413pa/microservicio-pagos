const mongoose = require ('mongoose');

const BancoSchema = new mongoose.Schema(
{
    nombre: {
        type: String
    },
    totalTransacciones: {
        type: Number,
        default:0,
    },
    transacciones: [
        {
            noTransaccion: {
                type: mongoose.Schema.Types.ObjectId,
            },
            metodosDePago: {
                correlativo: {
                    type: String,
                },
                idMetodo: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                monto: {
                    type: mongoose.Schema.Types.Decimal128,
                    default: 0.00
                }
            }
        }
    ],
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
module.exports = mongoose.model('bancos', BancoSchema);