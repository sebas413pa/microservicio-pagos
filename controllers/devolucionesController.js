'use strict'
const crypto = require("crypto");
const db = require('../models');
const { now } = require("mongoose");
const Banco = require('../models/bancos')
const Transaccion = require('../models/transaccion');
const Factura =  require('../models/facturas');
const Devolucion = require ('../models/devoluciones');
const { findOne } = require("../models/clientes");

module.exports = { 
    async create(req,res){
        const noTransaccion = req.body.NoTransaccion;
        const monto = req.body.Monto;
        const descripcion = req.body.Descripcion;
        const transaccion = await Transaccion.findOne({noTransaccion: noTransaccion});
        if(!transaccion){
            return res.status(500).json({ Mensaje: "Transaccion no valida" });
        }
        if(monto > transaccion.total)
        {
            return res.status(500).json({ Mensaje: "El monto ingresado no es valido" });
        }
        try {
            let count = await Devolucion.countDocuments();
            const factura = await Factura.findOne({noFactura:transaccion.noFactura});
            let notaCredito = "NOTA-" + String(count + 1).padStart(5, '0'); 
            const objetoCrear = new Devolucion({
                noTransaccion:noTransaccion,
                monto: monto,
                descripcion: descripcion,
                notaCredito: notaCredito,
                noAutorizacion: crypto.randomUUID()
            })

            const devolucion = await objetoCrear.save();
            const notaCreditoObjeto = {
                noNotaCredito: notaCredito,
                monto: monto,
                descripcion: descripcion
            }        
            const facturaActualizada = await Factura.findOneAndUpdate(
                {
                    _id : factura._id},
                {  
                $push:{ notasCredito: notaCreditoObjeto}
            }
            );
            return res.status(201).json({Mensaje:"Devolucion realizada correctamente"});
        } catch (error) {
            return res.status(500).json({ Mensaje: "Ocurrio un error", error });
        }
    
    }
}