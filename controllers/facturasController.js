'use strict'
const crypto = require("crypto");
const db = require('../models');
const { now } = require("mongoose");
const Banco = require('../models/bancos')
const Transaccion = require('../models/transaccion');
const Cliente = db.Cliente
const Factura =  require('../models/facturas');
const tarjetaService = require('../services/fidelidadService')

module.exports = {

async getFacturaById(req, res) {
        try {
          const id = req.params.noFactura;
        const factura = await Factura.findOne({noFactura:id});
      
          if (!factura) {
            return res.status(404).json({ mensaje: "Factura no encontrada" });
          }
      
          const respuesta = {
            factura: {
              NoFactura: factura.noFactura || "",
              Serie: factura.serie || "",
              Empresa: {
                NitEmpresa: factura.empresa?.nitEmpresa || "",
                NombreEmpresa: factura.empresa?.nombreEmpresa || "",
                TelefonoEmpresa: factura.empresa?.telefonoEmpresa || "",
                DireccionEmpresa: factura.empresa?.direccionEmpresa || ""
              },
              Fecha: factura.fecha || "",
              Cliente: {
                IdCliente: factura.cliente?.idCliente || "",
                NitCliente: factura.cliente?.nitCliente || "",
                NombreCliente: factura.cliente?.nombreCliente || "",
                ApellidoCliente: factura.cliente?.apellidoCliente || "",
                Direccion: factura.cliente?.direccionCliente || ""
              },
              Detalle: factura.detalle?.map(item => ({
                Producto: item.producto || "",
                Cantidad: item.cantidad || "",
                Precio: item.precio || ""
              })) || [],
              Total: factura.total || "",
              NotasCredito: factura.notasCredito?.map(nc => ({
                IdNota: nc._id?.toString() || "",
                Monto: nc.monto || "",
                Descripcion: nc.descripcion || ""
              })) || []
            }
          };
      
          return res.status(200).json(respuesta);
        } catch (error) {
          console.error("Error al obtener la factura:", error);
          return res.status(500).json({ mensaje: "Error al obtener la factura" });
        }
      },
      async anular(req, res) {
          const noFactura = req.params.noFactura;
          try {
              const factura = await Factura.findOne({ noFactura: noFactura });
      
              if (!factura) {
                  return res.status(404).json({ mensaje: "No se encontró la factura con el número proporcionado" });
              }
      
              await Factura.findByIdAndUpdate(factura._id, { estado: 0 });
              const transaccion = await Transaccion.findOne({noFactura: factura.noFactura});
              await Transaccion.findByIdAndUpdate(transaccion._id,{estado : 0});
              return res.status(200).json({ mensaje: "Factura anulada correctamente" });
          } catch (error) {
              console.error("Error al anular la factura:", error);
              return res.status(500).json({ mensaje: "No se pudo anular la factura", error });
          }
      },
      async obtenerTodas(req, res) {
        try{
          const facturas = await Factura.find();
          
          const respuesta = {
            Facturas: facturas.map(factura=> ({
              NoFactura: factura.noFactura || "",
              Serie: factura.serie || "",
              Empresa: {
                NitEmpresa: factura.empresa?.nitEmpresa || "",
                NombreEmpresa: factura.empresa?.nombreEmpresa || "",
                TelefonoEmpresa: factura.empresa?.telefonoEmpresa || "",
                DireccionEmpresa: factura.empresa?.direccionEmpresa || ""
              },
              Fecha: factura.fecha || "",
              Cliente: {
                IdCliente: factura.cliente?.idCliente || "",
                NitCliente: factura.cliente?.nitCliente || "",
                NombreCliente: factura.cliente?.nombreCliente || "",
                ApellidoCliente: factura.cliente?.apellidoCliente || "",
                Direccion: factura.cliente?.direccionCliente || ""
              },
              Detalle: factura.detalle?.map(item => ({
                Producto: item.producto || "",
                Cantidad: item.cantidad || "",
                Precio: item.precio || ""
              })) || [],
              Total: factura.total || "",
              NotasCredito: factura.notasCredito?.map(nc => ({
                IdNota: nc.noNotaCredito?.toString() || "",
                Monto: nc.monto || "",
                Descripcion: nc.descripcion || ""
              })) || []
            }))};

          return res.status(200).json(respuesta);
        }catch(error){
            console.error("Error al obtener las facturas:", error);
            return res.status(500).json({ mensaje: "Error al obtener las facturas" });
        }
      }
}