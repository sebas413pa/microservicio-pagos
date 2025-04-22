const   CierreCaja = require('../models/cierre');
const   mongoose = require('mongoose'); 

exports.obtenerCierres = async (req, res) => {
    try {
        const { fechaInicio, fechaFinal } = req.body;

        const filtroFecha = {};
        if (fechaInicio && fechaFinal) {
            filtroFecha.fecha = {
                $gte: new Date(fechaInicio),
                $lte: new Date(fechaFinal)
            };
        }

        const cierres = await CierreCaja.find(filtroFecha);

        const resultado = cierres.map(cierre => ({
            Id: cierre._id,
            IdCaja: cierre.idCaja,
            Servicio: cierre.idServicio,
            Fecha: cierre.fecha,
            CantidadInicial: cierre.cantidadIncial || 0,
            CantidadFinal: cierre.cantidadFinal,
            Diferencia: cierre.diferencia || 0,
            Empleado: cierre.usuario.length > 0 ? {
                IdEmpleado: cierre.usuario[0].idUsuario,
                NombreCompleto: cierre.usuario[0].nombreUsuario
            } : {},
            Retiros: cierre.retiros.map(retiro => ({
                NoRetiro: retiro.idRetiro,
                Monto: retiro.monto
            }))
        }));

        res.status(200).json({ cierre: resultado });
    } catch (error) {
        console.error('Error al obtener cierres:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los cierres de caja',
            error: error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const nuevoCierre = new CierreCaja(req.body);
        await nuevoCierre.save();
        res.status(201).json(nuevoCierre);
    } catch (error) {
        console.error('Error al crear cierre de caja:', error);
        res.status(500).json({ mensaje: 'Error al crear el cierre de caja', error: error.message });
    }
};





