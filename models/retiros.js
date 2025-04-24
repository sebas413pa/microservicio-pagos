const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const retiroSchema = new mongoose.Schema({
    noRetiro: {
        type: Number,
        required: true,
        AutoIncrement: true
    },
    idCaja: {
        type: Number,
        required: true
    },
    idServicio: {
        type: Number,
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
},
{ 
    timestamps: true  
}
);

retiroSchema.plugin(AutoIncrement, { inc_field: 'noRetiro' });

retiroSchema.statics.filtrarPorFecha = async function (fecha,servicio,caja) {
    const inicioDia = new Date(fecha);
    const finDia = new Date(fecha);
    finDia.setDate(finDia.getDate() + 1);

    return await this.find({
        fecha: {
            $gte: inicioDia,
            $lt: finDia

        },
        servicioTransaccion:servicio,
        idCaja:caja
    });
};

const Retiros = mongoose.model('Retiros', retiroSchema,'retiros');

module.exports = Retiros;
