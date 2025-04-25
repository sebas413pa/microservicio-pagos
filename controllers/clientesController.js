'use strict'
const db = require('../models')
const Cliente = db.Cliente
const mongoose = require('mongoose');


module.exports = 
{
    async list(req, res){
        try {
            const clientes = await Cliente.find().select('nombreCliente apellidosCliente nit direccion telefono email dpi tarjetaFidelidad estado');
            res.status(200).json({clientes:clientes});
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener los clientes', error });
        }
    },
    async buscarNit(req, res){
        const nit = req.params.nit
        try{
            const cliente = await Cliente.findOne({nit: nit, estado:1}).select('nombreCliente apellidosCliente nit direccion telefono email dpi tarjetaFidelidad estado');
            if(cliente){
                res.status(200).json({cliente:cliente})
            }
            else
            {
                res.status(500).json({mensaje:" El nit ingresado no está asociado con ningún cliente"})
            }
        }
        catch(error){
            res.status(500).json({ mensaje: 'Error al obtener el cliente', error });
        }
    },
    async create(req, res) {
        try {
            console.log("Cuerpo recibido:", req.body);
    
            const nombreCliente = req.body.NombreCliente;
            const apellidosCliente = req.body.ApellidosCliente;
            const nit = req.body.Nit;
            const direccion = req.body.Direccion;
            const telefono = req.body.Telefono;
            const email = req.body.Email;
            const dpi = req.body.Dpi;
    
            const cliente = new Cliente({
                nombreCliente,
                apellidosCliente,
                nit,
                direccion,
                telefono,
                email,
                dpi
            });
    
            await cliente.save();
            res.status(200).json(cliente);
        } catch (error) {
            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyValue)[0];
                return res.status(400).json({ 
                    mensaje: `Error: El campo '${duplicateField}' ya está en uso.`
                });
            }
            console.error("Error al crear el cliente:", error); 
            res.status(400).json({ mensaje: "Error al crear el cliente"});
        }
    }, 
    async update(req, res) {
        try {
            console.log("Cuerpo recibido:", req.body);
            const idCliente = req.params.idCliente
            const nombreCliente = req.body.NombreCliente;
            const apellidosCliente = req.body.ApellidosCliente;
            const direccion = req.body.Direccion;
            const telefono = req.body.Telefono;
            const email = req.body.Email;
    
            const clienteActualizado = await Cliente.findOneAndUpdate({_id: idCliente}, {
                nombreCliente: nombreCliente,
                apellidosCliente: apellidosCliente,
                direccion: direccion,
                telefono: telefono,
                email: email
            },
             {new: true});

            if (!clienteActualizado) {
                return res.status(500).json({ mensaje: "Cliente no encontrado" });
            }
            res.status(200).json({ClienteActualizado:clienteActualizado});
        } catch (error) {
            console.error("Error al editar el cliente:", error); 
            res.status(400).json({ mensaje: "Error al editar el cliente" });
        }
    },
    async delete(req, res)
    {
        try
        {
            const idCliente = req.params.idCliente
            const clienteElimianar = await Cliente.findOneAndUpdate({_id: idCliente}, {estado: 0})

            if(!clienteElimianar){
                return res.status(500).json({ mensaje: "Cliente no encontrado" });
            }

            return res.status(200).json({mensaje: "Cliente eliminado exitosamente"})
        }
        catch(error)
        {
            console.error("Error al eliminar el cliente"); 
            res.status(400).json({ mensaje: "Error al eliminar el cliente" });
        }
    },
    

}