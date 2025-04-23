'use strict'
const db = require('../models')
const Cliente = db.Cliente
module.exports =
{
    async agregar(req, res){
        try{
            const idCliente = req.params.idCliente
            const cliente = await Cliente.findOne({_id: idCliente, estado: 1})
            console.log(cliente)
            if(!cliente)
            {
                return res.status(500).json({ mensaje: "Cliente no encontrado" });
            }
            const cantidadTarjetas = cliente.tarjetaFidelidad.length;
            console.log(cantidadTarjetas)

            if(cantidadTarjetas != 0)
            {
                if(cliente.tarjetaFidelidad[cantidadTarjetas-1].estado == 1){
                    return res.status(422).json({mensaje: "El cliente tiene una tarjeta de fidelidad activa"})
                }
            }

            const noTarjetaFidelidad = "FID-" + cliente.dpi + "-" + cantidadTarjetas
    
            const fechaExpiracion = new Date();
            fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 2);

            const clienteActualizado = await Cliente.findOneAndUpdate({_id: idCliente}, 
                {
                    $push:
                        {
                            tarjetaFidelidad: {
                                noTarjeta: noTarjetaFidelidad,
                                cantidadPuntos: 0,
                                fechaExpiracion,
                                estado: 1
                        } 
                    }
                }
            )

            return res.status(200).json({mensaje:"Tarjeta agregada exitosamente", noTarjeta:noTarjetaFidelidad})
        }
        catch(error){
            console.error("Error al agregar tarjeta:", error); 
            res.status(400).json({ mensaje: "Error al agregar tarjeta"});
        }
    },
    async desactivar(req, res){
            try{
                const idCliente = req.params.idCliente
                const cliente = await Cliente.findOne({_id: idCliente, estado: 1})
                console.log(cliente)
                if(!cliente)
                {
                    return res.status(500).json({ mensaje: "Cliente no encontrado" });
                }
                const cantidadTarjetas = cliente.tarjetaFidelidad.length;
                console.log(cantidadTarjetas)

                if(cliente.tarjetaFidelidad[cantidadTarjetas-1].estado == 0){
                    return res.status(422).json({mensaje: "El cliente no tiene una tarjeta de fidelidad activa"})
                }

                const clienteActualizado = await Cliente.findOneAndUpdate(
                    { _id: idCliente, "tarjetaFidelidad.noTarjeta": cliente.tarjetaFidelidad[cantidadTarjetas-1].noTarjeta },  
                    { $set: { "tarjetaFidelidad.$.estado": 0 } },        
                    { new: true }
                );
                return res.status(200).json({mensaje:"Tarjeta desactivada exitosamente"})

            }catch(error){
                console.error("Error al actualizar tarjeta:", error);
                res.status(400).json({ mensaje: "Error al actualizar tarjeta" });
            }
    },


}