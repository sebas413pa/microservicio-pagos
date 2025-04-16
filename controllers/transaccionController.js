'use strict'
const crypto = require("crypto");
const db = require('../models');
const { now } = require("mongoose");
const Banco = db.Banco
const Transaccion = db.Transaccion
const Cliente = db.Cliente

module.exports = {
    async create(req, res){
        try
        {
            console.log("Cuerpo recibido: ", req.body);
            const nit = req.body.Nit
            const idCaja = req.body.idCaja
            const servicioTransaccion = req.body.IdServicioTransaccion
            const detalle = {
                producto : req.body.Detalle.Producto,
                cantidad: req.body.Detalle.Cantidad,
                precio: req.body.Detalle.Precio,
                descuento: req.body.Detalle.Descuento
            }
            const metodosPago = {
                noTarjeta: req.body.MetodosPago.NoTarjeta,
                idMetodo: req.body.MetodosPago.IdMetodo,
                monto: req.body.MetodosPago.Monto,
                idBanco: req.body.MetodosPago.IdBanco,
                correlativo
            }

            const cliente = Cliente.findOne({nit: nit, estado:1})

            if(!cliente)
            {
                return res.status(500).json({mensaje: "El cliente no existe en la base de datos, debe crearlo"})
            }
            if(servicioTransaccion != (4, 5, 6, 7))
            {
                return res.status(500).json({mensaje: "El servicio ingresado no es valido"})
            }
            
            let totalCompra = 0
            detalle.array.forEach(element => {
                totalCompra += (element.Cantidad * element.precio)
                totalCompra = totalCompra - (totalCompra* element.Descuento)
            });

            /*
                Efectivo -> 1
                Tarjeta Credito -> 2
                Tarjeta Debito -> 3
                Transaccion -> 4
                Fidelidad -> 5
            */

            let totalPagado = 0
            metodosPago.array.forEach(element => {
                totalPagado += element.monto
                switch(element.IdMetodo){
                    case 1:
                        const noEfectivo = Transaccion.countByMetodoPago(1);
                        element.correlativo = "EFECTIVO-"+noEfectivo
                    case 2:
                        const noCredito = Transaccion.countByMetodoPago(2)
                        element.correlativo = "CRED-"+noCredito
                    case 3:
                        const noDebito = Transaccion.countByMetodoPago(3)
                        element.correlativo = "DEB-"+noDebito
                    case 4:
                        const noTransferencia = Transaccion.countByMetodoPago(4)
                        const nombreBanco = Banco.getByNombreId(element.idBanco).nombre
                        const totalTransaccionesBanco = Banco.getByNombreId(element.idBanco).totalTransacciones
                        element.correlativo = nombreBanco.substring(0,4) +"-"+noTransferencia+totalTransaccionesBanco
                    case 5:
                        const noTarjetaFidelidad = Transaccion.countByMetodoPago(5)
                        element.correlativo = "FID-"+noTarjetaFidelidad
                }

            })

            if(totalCompra != totalPagado)
            {
                return res.status(500).json({mensaje: "El total de compra no coincide con el total pagado"})
            }


            const objetoTransaccion = {
                noAutorizacion : crypto.randomUUID(),
                fecha : now(),
                idCliente : cliente.idCliente,
                noFactura : null,
                total : totalCompra,
                idCaja,
                servicioTransaccion,
                metodosPago,
                detalle
            }
            
            await objetoTransaccion.save()
        }
        catch
        {

        }
    }
}