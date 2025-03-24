'use strict'
const db = require('../models')
const Cliente = db.Cliente

module.exports = 
{
    async list(req, res){
        try {
            const clientes = await Cliente.find();
            res.status(200).json(clientes);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los clientes', error });
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
            const noTarjetaFidelidad = "FID-" + dpi + "-0";
    
            const fechaExpiracion = new Date();
            fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 2);
    
            const cliente = new Cliente({
                nombreCliente,
                apellidosCliente,
                nit,
                direccion,
                telefono,
                email,
                dpi,
                tarjetaFidelidad: [
                    {
                        noTarjeta: noTarjetaFidelidad,
                        cantidadPuntos: 0,
                        fechaExpiracion,
                        estado: 1
                    }
                ]
            });
    
            await cliente.save();
            res.status(201).json(cliente);
        } catch (error) {
            console.error("Error al crear el cliente:", error); 
            res.status(400).json({ message: "Error al crear el cliente", error });
        }
    }, 
    async update(req, res) {
        try {
            console.log("Cuerpo recibido:", req.body);
            
            const idCliente = req.params.idCliente
            const nombreCliente = req.body.NombreCliente;
            const apellidosCliente = req.body.ApellidosCliente;
            const nit = req.body.Nit;
            const direccion = req.body.Direccion;
            const telefono = req.body.Telefono;
            const email = req.body.Email;
            const dpi = req.body.Dpi;
            const noTarjetaFidelidad = "FID-" + dpi + "-0";
    
            const fechaExpiracion = new Date();
            fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 2);
    
            const cliente = new Cliente({
                nombreCliente,
                apellidosCliente,
                nit,
                direccion,
                telefono,
                email,
                dpi,
                tarjetaFidelidad: [
                    {
                        noTarjeta: noTarjetaFidelidad,
                        cantidadPuntos: 0,
                        fechaExpiracion,
                        estado: 1
                    }
                ]
            });
    
            await cliente.save();
            res.status(201).json(cliente);
        } catch (error) {
            console.error("Error al crear el cliente:", error); 
            res.status(400).json({ message: "Error al crear el cliente", error });
        }
    }    

}