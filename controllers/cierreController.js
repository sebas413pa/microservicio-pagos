const Transaccion = require('../models/transaccion');
const   CierreCaja = require('../models/cierre');
const   mongoose = require('mongoose'); 
const MetodoPago = require('../models/metodos');
const Retiros = require('../models/retiros');

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
            Retiros: (cierre.retiros || []).map(retiro => ({ // Usa un array vacío si retiros es null o undefined
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
        console.log(req.body);
        const nuevoCierre = new CierreCaja(req.body);
        const idCaja = req.body.IdCaja;
        const idServicio = req.body.Servicio;
        const cantidadFinal = req.body.CantidadFinal;
        const empleado = req.body.Empleado;
        const fecha = new Date();
        const soloFecha = fecha.toISOString().split('T')[0];
        const Transacciones = await Transaccion.filtrarPorFecha(soloFecha,idServicio,idCaja);
        console.log(Transacciones);
        let totalDia = 0;
        const ultimoCierre = await CierreCaja.findOne({
            idCaja: idCaja,         
            idServicio: idServicio     
        }).sort({ fecha: -1 });
        let cantidadInicial = 0;
        console.log("EL ULTIMO CIERRE ES", ultimoCierre);
        if(ultimoCierre){
            cantidadInicial = ultimoCierre.cantidadFinal;
            console.log(cantidadInicial);
        }

        for (const transaccion of Transacciones){
            console.log(transaccion);
            for(const metodoPago of transaccion.metodosPago){
                console.log(metodoPago);
                if(metodoPago.idMetodo == 1){
                    totalDia += metodoPago.monto;
                }

            }
        }
        const retiros = await Retiros.filtrarPorFecha(soloFecha,idServicio,idCaja);
        let cantidadRetirada = 0;
        for(const retiro of retiros){
            cantidadRetirada += retiro.monto;
        }
        let cantidadFinal1 = cantidadInicial + totalDia - cantidadRetirada;
        console.log(totalDia);

        const ObjetoCierre = new CierreCaja ({
            idCaja: idCaja,
            idServicio: idServicio,
            fecha: soloFecha,
            cantidadInicial: cantidadInicial,
            cantidadFinal: cantidadFinal1,
            diferencia: cantidadFinal1 - cantidadFinal,
            usuario: {
                idUsuario: empleado.IdEmpleado,
                nombreUsuario: empleado.NombreCompleto
            }
        });
        const cierreGuardado = await ObjetoCierre.save();
        console.log(cierreGuardado);

        const objetoCierreGuardado = {
            IdCaja: cierreGuardado.idCaja,
            IdServicio: cierreGuardado.idServicio,
            Fecha: cierreGuardado.fecha,
            CantidadFinal: cierreGuardado.cantidadFinal,
            Diferencia: cierreGuardado.diferencia,
            Usuario: [
                {
                    idUsuario: cierreGuardado.usuario.idUsuario,
                    nombreUsuario: cierreGuardado.usuario.nombreUsuario
                }
            ],
            _id: cierreGuardado._id,
            CreatedAt: cierreGuardado.createdAt,
            UpdatedAt:cierreGuardado.updatedAt 
        }
        //await nuevoCierre.save();
        res.status(201).json(objetoCierreGuardado);
    } catch (error) {
        console.error('Error al crear cierre de caja:', error);
        res.status(500).json({ mensaje: 'Error al crear el cierre de caja', error: error.message });
    }
};

// export const createRetiro = async (req, res) => {
//     const idCaja = req.body.IdCaja;
//     const monto = req.body.Monto;
//     const idServicio = req.body.Servicio;


//     try{

//     }catch(error){

//     }
// }






