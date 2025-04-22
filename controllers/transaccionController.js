'use strict'
const crypto = require("crypto");
const db = require('../models');
const { now } = require("mongoose");
const Banco = require('../models/bancos')
const Transaccion = require('../models/transaccion');
const Cliente = db.Cliente
const Factura =  require('../models/facturas');
const tarjetaService = require('../services/fidelidadService')

async function generarCorrelativoBanco (idBanco)
    {
        let banco, nombreBanco
        const noTransferencia = await Transaccion.countByMetodoPago(4);
        try{
            banco = await Banco.getNombreById(idBanco)
            if(!banco){
                return res.status(500).json({mensaje: "Banco ingresado no existente"})
            }
            nombreBanco = banco.nombre
            console.log("banco:" , banco)
            console.log("nombre del banco ",nombreBanco)
        }
        catch(error){
            console.log("Banco no valido")
            return res.status(500).json({mensaje: "Ocurrio un error"})
        }
        const totalTransaccionesBanco = banco.totalTransacciones
        const siglas  = nombreBanco
                        .split(' ')              
                        .map(p => p[0])          
                        .join('')               
                        .toUpperCase();   
        return siglas + "-"+noTransferencia + totalTransaccionesBanco
    }

async function generarFactura(detalle, cliente, total, totalDescuento){
    const count = await Factura.countDocuments();
    const noFactura = "FACT-" + String(count + 1).padStart(5, '0'); 
    let clienteFactura
    if(cliente)
    {
        clienteFactura = {
            idCliente :cliente._id,
            nitCliente:cliente.nit,
            nombreCliente: cliente.nombreCliente,
            apellidoCliente: cliente.apellidosCliente,
            direccionCliente: cliente.direccion
        }
    }
    else
    { 
        clienteFactura = {
            idCliente: null,
            nit: "CF",
            nombreCliente: "Consumidor",
            apellidoCliente: "Final",
            direccion: "Ciudad"
        }
    }
    const objetoFactura = new Factura( {
        noFactura: noFactura,
        detalle: detalle,
        total: total,
        totalDescontado: totalDescuento,
        cliente: clienteFactura,
        empresa:{}
    })
    const factura = await objetoFactura.save()
    return factura
}

module.exports = {
    async create(req, res){
            console.log('Transaccion:', Transaccion);
            console.log("Cuerpo recibido: ", req.body);
            const nit = req.body.Nit
            const idCaja = req.body.IdCaja
            const servicioTransaccion = req.body.IdServicioTransaccion
            const detalle = req.body.Detalle;
            const metodosPago = req.body.MetodosPago;
            let cliente = null
            
            if(nit)
            {
                cliente = await Cliente.findOne({nit: nit, estado:1})
                console.log("Cliente ingresado: ", cliente)
    
                if(!cliente)
                {
                    return res.status(500).json({mensaje: "El cliente no existe en la base de datos, debe crearlo"})
                }
                if(servicioTransaccion != 4)
                {
                    return res.status(500).json({mensaje: "El servicio ingresado no es valido"})
                }
            }
            
            let totalCompra = 0
            let detalleProcesado = []
            let totalDescuento = 0
            let total = 0
            detalle.forEach(element => {
                const detalleActual =
                {
                    producto: element.Producto,
                    cantidad :parseFloat(element.Cantidad),
                    precio : parseFloat(element.Precio),
                    descuento : parseFloat(element.Descuento) || 0
                }

                const subtotal = detalleActual.cantidad * detalleActual.precio;
                total += subtotal
                const descuentoAplicado = subtotal * detalleActual.descuento;
                totalDescuento += descuentoAplicado
                totalCompra += subtotal - descuentoAplicado;

                detalleProcesado.push(detalleActual)

            });

            console.log("El total de compra es: ", totalCompra)
            /*
                Efectivo -> 1
                Tarjeta Credito -> 2
                Tarjeta Debito -> 3
                Transaccion -> 4
                Fidelidad -> 5
            */
            let totalPagado = 0
            let metodosPagoProcesados = []
            for(const element of metodosPago){

                const metodoPago = {
                    noTarjeta : element.NoTarjeta,
                    idMetodo : parseInt(element.IdMetodo),
                    monto : parseFloat(element.Monto),
                    idBanco : element.IdBanco,
                    correlativo: null
                }
                console.log("Metodo pago actual ", metodoPago)
                totalPagado += metodoPago.monto
                if ([2, 3, 5].includes(metodoPago.idMetodo) && (!metodoPago.noTarjeta || metodoPago.noTarjeta.trim() === '')) {
                    return res.status(400).json({
                        mensaje: `El campo 'noTarjeta' es obligatorio para el método de pago ${metodoPago.idMetodo}`
                    });
                }
            
                if (metodoPago.idMetodo === 4 && (!metodoPago.idBanco || metodoPago.idBanco.toString().trim() === '')) {
                    return res.status(400).json({
                        mensaje: "El campo 'idBanco' es obligatorio para el método de pago 4 (transferencia)"
                    });
                }
                if (metodoPago.noTarjeta) {
                    const longitud = metodoPago.noTarjeta.length;
                    if (longitud > 4) {
                        const ultimos4 = metodoPago.noTarjeta.slice(-4);
                        const oculto = '*'.repeat(longitud - 4) + ultimos4;
                        metodoPago.noTarjeta = oculto;
                    } else {
                        metodoPago.noTarjeta = metodoPago.noTarjeta.padStart(4, '*'); // Por si es muy corta
                    }
                }
                
                switch(metodoPago.idMetodo){
                    case 1:
                        const noEfectivo = await Transaccion.countByMetodoPago(1);
                        metodoPago.correlativo = "EFECTIVO-"+noEfectivo
                        console.log(metodoPago.correlativo)
                        break;
                    case 2:
                        const noCredito = await Transaccion.countByMetodoPago(2);
                        metodoPago.correlativo = "CRED-"+noCredito
                        console.log(metodoPago.correlativo)
                        break;
                    case 3:
                        const noDebito = await Transaccion.countByMetodoPago(3);
                        metodoPago.correlativo = "DEB-"+noDebito
                        console.log(metodoPago.correlativo)
                        break;
                    case 4:
                        metodoPago.correlativo =await generarCorrelativoBanco(metodoPago.idBanco)
                        console.log(metodoPago.correlativo)
                        break;
                    case 5:
                        const noTarjetaFidelidad = await Transaccion.countByMetodoPago(5)
                        metodoPago.correlativo = "FID-"+noTarjetaFidelidad
                        console.log(metodoPago.correlativo)
                        break;
                    default:
                        return res.status(500).json({mensaje: "Metodo de pago no valido"})
                }
                metodosPagoProcesados.push(metodoPago);


            }

            console.log("El total pagado es: ", totalPagado)
            if(totalCompra != totalPagado)
            {
                console.log("No se puede completar la transaccion porque el total de compra no coincide con el total pagado")
                return res.status(500).json({mensaje: "El total de compra no coincide con el total pagado"})
            }
            const objetoTransaccion = new Transaccion ({
                noAutorizacion : crypto.randomUUID(),
                fecha : new Date(),
                noFactura : null,
                total : totalCompra,
                idCaja,
                servicioTransaccion,
                metodosPago: metodosPagoProcesados,
                detalle: detalleProcesado
            })
            let facturaHecha

            try {
                facturaHecha = await generarFactura(detalleProcesado, cliente, totalCompra, totalDescuento);
                console.log("Factura generada:", facturaHecha);
                objetoTransaccion.noFactura = facturaHecha.noFactura;

            } catch (error) {
                console.error("Error al generar la factura:", error);
                return res.status(500).json({ mensaje: "Error al generar la factura", error });
            }
            

            try {
                const transaccionHecha = await objetoTransaccion.save();
                console.log(transaccionHecha)
                const facturaLimpia = facturaHecha.toObject()
                delete facturaLimpia._id
                delete facturaLimpia.__v
                const objetoRespuesta = {
                    mensaje: "Transacción realizada correctamente",
                    idTransaccion: transaccionHecha._id,
                    noTransaccion: transaccionHecha.noTransaccion,
                    noAutorizacion: transaccionHecha.noAutorizacion,
                    factura: facturaLimpia
                }
                if(cliente)
                {
                   await tarjetaService.sumarPuntos(cliente._id, totalCompra)
                }

                return res.status(201).json(objetoRespuesta);
            } catch (error) {
                console.error("Error al guardar la transacción:", error);
                return res.status(500).json({ mensaje: "Error al guardar la transacción", error });
            }                 
    },

    
    
}