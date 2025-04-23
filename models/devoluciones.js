const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const devolucionesSchema = new mongoose.Schema({
    noDevolucion:{
        type: Number
    },
    notaCredito:{
        type: String
    },
    noAutorizacion:{
        type: String
    },
    noTransaccion:{
        type: Number
    },
    monto:{
        type: Number
    },
    descripcion:{
        type: String
    }
},{
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v; 
            return ret;
        }
    }
})
devolucionesSchema.plugin(AutoIncrement, { inc_field: 'noDevolucion' });

const Devolucion = mongoose.model('Devolucion', devolucionesSchema, 'devoluciones');
module.exports = Devolucion;
