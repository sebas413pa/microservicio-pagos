const Retiros = require('../models/retiros');
const mongoose = require('mongoose'); 

exports.create = async (req, res) => {
    try {
        const idCaja = req.body.IdCaja;
        const idServicio = req.body.Servicio;
        const monto = req.body.Monto;
        const fecha = new Date();
        const soloFecha = fecha.toISOString().split('T')[0];   
        const nuevoRetiro = new Retiros({
            idCaja: idCaja,
            idServicio: idServicio,
            monto: monto,
            fecha: soloFecha
        });
        const retiroCreado = await nuevoRetiro.save();
        console.log(retiroCreado);
        res.status(200).json({mensaje: 'Retiro creado exitosamente'});

    } catch (error) {
        console.error('Error al crear el retiro:', error);
        res.status(500).json({
            mensaje: 'Error al crear el retiro',
            error: error.message
        });
    }
}