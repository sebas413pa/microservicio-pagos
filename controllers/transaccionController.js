'use strict'
const crypto = require("crypto");
const db = require('../models');
const { now } = require("mongoose");
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
                        //aca se va a tener que buscar el banco por su id, tomar las primeras 4 letras del nombre - numero de transaccion en ese banco - numero de transacciones totales
                }

            })

            if(totalCompra != totalPagado)
            {
                return res.status(500).json({mensaje: "El total de compra no coincide con el total pagado"})
            }
            const idCliente = cliente.idCliente


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
            
        }
        catch
        {

        }
    }
}