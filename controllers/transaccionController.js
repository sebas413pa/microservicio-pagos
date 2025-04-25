'use strict'
const crypto = require("crypto");
const db = require('../models');
const { now } = require("mongoose");
const Banco = require('../models/bancos')
const Transaccion = require('../models/transaccion');
const Cliente = db.Cliente
const Factura = require('../models/facturas');
const Metodo = require('../models/metodos')
const tarjetaService = require('../services/fidelidadService')

async function agregarTransaccionBanco(idBanco, metodoPago) {
    const banco = await Banco.findById(idBanco);

    if (!banco) {
        return res.status(500).json({ mensaje: "Banco ingresado no existente" })
        
    }
    const nuevaTransaccion = {
        noTransaccion: null,
        idBanco: idBanco,
        metodosDePago: {
            correlativo: metodoPago.correlativo,
            idMetodo: metodoPago.idMetodo,
            monto: metodoPago.monto
        }
    }
    console.log(nuevaTransaccion);
    return nuevaTransaccion;
}
async function agregarTransaccionMetodos(noMetodo, metodoPago, nit){
    const metodo = await Metodo.findOne({noMetodo: noMetodo})
    if(!metodo){
        res.status(500).json({mensaje:"Metodo de pago no valido"})
    }
    const nuevaTransaccion = {
        idMetodo: metodo._id,
        noTransaccion: null, 
        correlativo: metodoPago.correlativo,
        idBanco: metodoPago.idBanco || null,
        noTarjeta: metodoPago.noTarjeta || null,
        monto: metodoPago.monto,
        nitCliente: nit||null
    }
    return nuevaTransaccion
}

async function generarCorrelativoBanco(idBanco) {
    let banco, nombreBanco
    const noTransferencia = await Transaccion.countByMetodoPago(4);
    try {
        banco = await Banco.getNombreById(idBanco)
        if (!banco) {
            return res.status(500).json({ mensaje: "Banco ingresado no existente" })
        }
        nombreBanco = banco.nombre
        console.log("banco:", banco)
        console.log("nombre del banco ", nombreBanco)
    }
    catch (error) {
        console.log("Banco no valido")
        return res.status(500).json({ mensaje: "Ocurrio un error" })
    }
    const totalTransaccionesBanco = banco.totalTransacciones
    const siglas = nombreBanco
        .split(' ')
        .map(p => p[0])
        .join('')
        .toUpperCase();
    return siglas + "-" + noTransferencia + totalTransaccionesBanco
}
async function generarFactura(detalle, cliente, total, totalDescuento) {
    const count = await Factura.countDocuments();
    const noFactura = "FACT-" + String(count + 1).padStart(5, '0');
    let clienteFactura
    if (cliente) {
        clienteFactura = {
            idCliente: cliente._id,
            nitCliente: cliente.nit,
            nombreCliente: cliente.nombreCliente,
            apellidoCliente: cliente.apellidosCliente,
            direccionCliente: cliente.direccion
        }
    }
    else {
        clienteFactura = {
            idCliente: null,
            nit: "CF",
            nombreCliente: "Consumidor",
            apellidoCliente: "Final",
            direccion: "Ciudad"
        }
    }
    const objetoFactura = new Factura({
        noFactura: noFactura,
        detalle: detalle,
        total: total,
        totalDescontado: totalDescuento,
        cliente: clienteFactura,
        empresa: {}
    })
    const factura = await objetoFactura.save()
    return factura
}

    module.exports = {
        async listByService(req, res) {
            const { fechaInicial, fechaFinal } = req.body;
            const idServicio = req.params.idServicio;
            let filtro = {};

            filtro.servicioTransaccion = parseInt(idServicio);
            if (fechaInicial || fechaFinal) {
                filtro.fecha = {};
                if (fechaInicial) filtro.fecha.$gte = new Date(fechaInicial);
                if (fechaFinal) filtro.fecha.$lte = new Date(fechaFinal);
            }
            console.log(filtro);
            try {
                const transacciones = await Transaccion.find(filtro);

                const resultado = transacciones.map(trans => ({
                    idTransaccion: trans._id,
                    NoAutorizacion: trans.noAutorizacion,
                    NoTransaccion: trans.noTransaccion,
                    Fecha: trans.fecha,
                    IdCliente: trans.idCliente,
                    NoFactura: trans.noFactura,
                    Total: trans.total,
                    IdCaja: trans.idCaja,
                    ServiciosTransaccion: trans.servicioTransaccion,
                    Estado: trans.estado,
                    MetodosDePago: trans.metodosPago.map(mp => ({
                        NoTarjeta: mp.noTarjeta,
                        IdMetodo: mp.idMetodo,
                        Monto: mp.monto,
                        Correlativo: mp.correlativo,
                        IdBanco: mp.idBanco
                    }))
                }));

                return res.status(200).json({ Transacciones: resultado });
            } catch (error) {
                console.error("Error al obtener transacciones:", error);
                return res.status(500).json({ mensaje: "Error al obtener las transacciones" });
            }
        },
        async anular(req, res) {
            const noTransaccion = req.params.noTransaccion;
            try {
                const transaccion = await Transaccion.findOne({ noTransaccion: noTransaccion });

                if (!transaccion) {
                    return res.status(404).json({ mensaje: "No se encontró la transacción con el número proporcionado" });
                }

                await Transaccion.findByIdAndUpdate(transaccion._id, { estado: 0 });
                const factura = await Factura.findOne({ noFactura: transaccion.noFactura });
                await Factura.findByIdAndUpdate(factura._id, { estado: 0 });
                return res.status(200).json({ mensaje: "Transacción anulada correctamente" });
            } catch (error) {
                console.error("Error al anular la transacción:", error);
                return res.status(500).json({ mensaje: "No se pudo anular la transacción", error });
            }
        },
        async listById(req, res) {
            const id = req.params.noTransaccion;
            const transaccion = await Transaccion.findOne({ noTransaccion: id });
            const MetodosDePago = transaccion.metodosPago.map(metodo => ({
                NoTarjeta: metodo.noTarjeta,
                IdMetodo: metodo.idMetodo,
                Monto: metodo.monto,
                Correlativo: metodo.correlativo,
                IdBanco: metodo.idBanco
            }));

            const transaccionObjeto = {
                Transaccion: {
                    idTransaccion: transaccion._id,
                    NoAutorizacion: transaccion.noAutorizacion,
                    NoTransacion: transaccion.noTransaccion,
                    Fecha: transaccion.fecha,
                    NoFactura: transaccion.noFactura,
                    Total: transaccion.total,
                    IdCaja: transaccion.idCaja,
                    ServiciosTransaccion: transaccion.servicioTransaccion,
                    Estado: transaccion.estado,
                    MetodosDePago: MetodosDePago
                }
            };
            res.status(200).json(transaccionObjeto);
            return transaccion;
        },
        async list(req, res) {
            const { fechaInicial, fechaFinal } = req.body;

            let filtro = {};

            if (fechaInicial || fechaFinal) {
                filtro.fecha = {};
                if (fechaInicial) filtro.fecha.$gte = new Date(fechaInicial);
                if (fechaFinal) filtro.fecha.$lte = new Date(fechaFinal);
            }

            try {
                const transacciones = await Transaccion.find(filtro);

                const resultado = transacciones.map(trans => ({
                    idTransaccion: trans._id,
                    NoAutorizacion: trans.noAutorizacion,
                    NoTransaccion: trans.noTransaccion,
                    Fecha: trans.fecha,
                    IdCliente: trans.idCliente,
                    NoFactura: trans.noFactura,
                    Total: trans.total,
                    IdCaja: trans.idCaja,
                    ServiciosTransaccion: trans.servicioTransaccion,
                    Estado: trans.estado,
                    MetodosDePago: trans.metodosPago.map(mp => ({
                        NoTarjeta: mp.noTarjeta,
                        IdMetodo: mp.idMetodo,
                        Monto: mp.monto,
                        Correlativo: mp.correlativo,
                        IdBanco: mp.idBanco
                    }))
                }));

                return res.status(200).json({ Transacciones: resultado });
            } catch (error) {
                console.error("Error al obtener transacciones:", error);
                return res.status(500).json({ mensaje: "Error al obtener las transacciones" });
            }
        },
        async create(req, res) {
            console.log('Transaccion:', Transaccion);
            console.log("Cuerpo recibido: ", req.body);
            const nit = req.body.Nit
            const idCaja = req.body.IdCaja
            const servicioTransaccion = req.body.IdServicioTransaccion
            const detalle = req.body.Detalle;
            const metodosPago = req.body.MetodosPago;
            let puntosSumar = 0;
            let cliente = null

            if (nit) {
                cliente = await Cliente.findOne({ nit: nit, estado: 1 })
                console.log("Cliente ingresado: ", cliente)
                let servicioTransaccion1 = parseInt(servicioTransaccion);
                if (!cliente) {
                    return res.status(500).json({ mensaje: "El cliente no existe en la base de datos, debe crearlo" })
                }
                if (servicioTransaccion1 < 1 && servicioTransaccion1 > 8) {
                    return res.status(500).json({ mensaje: "El servicio ingresado no es valido" })
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
                    cantidad: parseFloat(element.Cantidad),
                    precio: parseFloat(element.Precio),
                    descuento: parseFloat(element.Descuento) || 0
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
            let arregloTransacciones = []
            let arregloTransaccionesMetodos = []
            for (const element of metodosPago) {

                const metodoPago = {
                    noTarjeta: element.NoTarjeta,
                    idMetodo: parseInt(element.IdMetodo),
                    monto: parseFloat(element.Monto),
                    idBanco: element.IdBanco,
                    correlativo: null
                }
                console.log("Metodo pago actual ", metodoPago)
                totalPagado += metodoPago.monto
                if ([2, 3].includes(metodoPago.idMetodo) && (!metodoPago.noTarjeta || metodoPago.noTarjeta.trim() === '')) {
                    return res.status(400).json({
                        mensaje: `El campo 'noTarjeta' es obligatorio para el método de pago ${metodoPago.idMetodo}`
                    });
                }

                if ((metodoPago.idMetodo === 2 || metodoPago.idMetodo === 3 || metodoPago.idMetodo === 4) && (!metodoPago.idBanco || metodoPago.idBanco.toString().trim() === '')) {
                    return res.status(400).json({
                        mensaje: "El campo 'idBanco' es obligatorio para el método de pago"
                    });
                }
                if (metodoPago.noTarjeta) {
                    const longitud = metodoPago.noTarjeta.length;
                    if (longitud > 4) {
                        const ultimos4 = metodoPago.noTarjeta.slice(-4);
                        const oculto = '*'.repeat(longitud - 4) + ultimos4;
                        metodoPago.noTarjeta = oculto;
                    } else {
                        metodoPago.noTarjeta = metodoPago.noTarjeta.padStart(4, '*');
                    }
                }
                
                switch (metodoPago.idMetodo) {
                    case 1:
                        const noEfectivo = await Transaccion.countByMetodoPago(1);
                        metodoPago.correlativo = "EFECTIVO-" + noEfectivo
                        console.log(metodoPago.correlativo)
                        break;
                    case 2:
                        const noCredito = await Transaccion.countByMetodoPago(2);
                        metodoPago.correlativo = "CRED-" + noCredito
                        console.log(metodoPago.correlativo)
                        break;
                    case 3:
                        const noDebito = await Transaccion.countByMetodoPago(3);
                        metodoPago.correlativo = "DEB-" + noDebito
                        console.log(metodoPago.correlativo)
                        break;
                    case 4:
                        metodoPago.correlativo = await generarCorrelativoBanco(metodoPago.idBanco)
                        console.log(metodoPago.correlativo)
                        break;
                    case 5:
                        const puntosNecesarios = metodoPago.monto;
                        puntosSumar -= metodoPago.monto;
                        const resultado = await tarjetaService.restarPuntos(cliente._id, puntosNecesarios);
                        if (!resultado.ok) {
                            console.log("LOS PUNTOS NO SON SUFICIENTES");
                            return res.status(400).json({ mensaje: resultado.mensaje });
                        }

                        const noTarjetaFidelidad = await Transaccion.countByMetodoPago(5);
                        metodoPago.correlativo = "FID-" + noTarjetaFidelidad;
                        console.log(metodoPago.correlativo);
                        break;
                    default:
                        return res.status(500).json({ mensaje: "Metodo de pago no valido" })
                }                
                metodosPagoProcesados.push(metodoPago);
                arregloTransaccionesMetodos.push(await agregarTransaccionMetodos(metodoPago.idMetodo, metodoPago, nit))
                if (metodoPago.idMetodo == 2 || metodoPago.idMetodo == 3 || metodoPago.idMetodo == 4) {
                    arregloTransacciones.push(await agregarTransaccionBanco(metodoPago.idBanco,metodoPago));
                }
            }
            console.log(arregloTransacciones,"ESTE ES EL ARREGLO DE TRANSACCIONES");
            console.log("El total pagado es: ", totalPagado)
            if (totalCompra != totalPagado) {
                console.log("No se puede completar la transaccion porque el total de compra no coincide con el total pagado")
                return res.status(500).json({ mensaje: "El total de compra no coincide con el total pagado" })
            }
            let id_cliente
            if(cliente)
            {
                id_cliente = cliente._id
            }
            else
            {
                id_cliente = null
            }
            const objetoTransaccion = new Transaccion({
                noAutorizacion: crypto.randomUUID(),
                fecha: new Date(),
                noFactura: null,
                total: totalCompra,
                idCaja,
                servicioTransaccion,
                metodosPago: metodosPagoProcesados,
                detalle: detalleProcesado,
                idCliente: id_cliente
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
                console.log(transaccionHecha);
                for (const element of arregloTransacciones) {
                    element.noTransaccion = transaccionHecha._id;

                    await Banco.findOneAndUpdate(
                        { _id: element.idBanco },
                        {
                            $push: { transacciones: element },
                            $inc: { totalTransacciones: 1 } 
                        }
                    );
                }

                for (const element of arregloTransaccionesMetodos) {
                    element.noTransaccion = transaccionHecha._id;
                    await Metodo.findOneAndUpdate({ _id: element.idMetodo }, {
                        $push: {
                            transacciones: element
                        }
                    })
                }

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
                if (cliente) {
                    puntosSumar += totalCompra;
                    console.log(puntosSumar);
                    await tarjetaService.sumarPuntos(cliente._id, puntosSumar)
                }

                return res.status(201).json(objetoRespuesta);
            } catch (error) {
                console.error("Error al guardar la transacción:", error);
                return res.status(500).json({ mensaje: "Error al guardar la transacción"});
            }
        },
    }