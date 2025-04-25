const { Router } = require('express');
const router = Router();
const bancosController = require('../controllers/bancosController')
const metodo = require('../controllers/metodosController');
const cierre = require('../controllers/cierreController');
const clientesController = require('../controllers/clientesController')
const fidelidadController = require('../controllers/fidelidadController')
const transaccionesController = require('../controllers/transaccionController')
const facturasController = require('../controllers/facturasController');
const devolucionesController = require('../controllers/devolucionesController');
const retirosController = require ('../controllers/retirosController');
router.post('/metodos/crear', metodo.create);
router.put('/metodos/eliminar/:_id', metodo.eliminarMetodo);
router.get('/metodos/obtener', metodo.obtenerMetodosPago);
router.get('/metodos/obtener/:_id', metodo.obtenerMetodoPagoPorId);

module.exports = (app) => {
    
    //Clientes
    router.post('/cliente/crear', clientesController.create)
    router.get('/cliente/obtener', clientesController.list)
    router.get('/cliente/obtener/:nit', clientesController.buscarNit)
    router.put('/cliente/actualizar/:idCliente', clientesController.update)
    router.put('/cliente/eliminar/:idCliente', clientesController.delete)

    //Tarjeta fidelidad
    router.post('/cliente/fidelidad/crear/:idCliente', fidelidadController.agregar)
    router.put('/cliente/fidelidad/desactivar/:idCliente', fidelidadController.desactivar)

    //Métodos de pago
    router.post('/metodos/crear', metodo.create);
    router.put('/metodos/eliminar/:_id', metodo.eliminarMetodo);
    router.get('/metodos/obtener', metodo.obtenerMetodosPago);
    router.get('/metodos/obtener/:_id', metodo.obtenerMetodoPagoPorId);
    router.get('/metodos/obtenerTransacciones/:noMetodo', metodo.obtenerTransaccionesMetodo)

    // Cierre de caja
    router.get('/cierres/obtener', cierre.obtenerCierres); 
    router.post('/cierres/crear', cierre.create);
    
    //BANCOS
    router.post('/bancos/crear',bancosController.crearBanco);
    router.get('/bancos/obtener',bancosController.obtenerBancos);
    router.get('/bancos/obtener/:id',bancosController.obtenerBancoPorId);
    router.put('/bancos/eliminar/:id',bancosController.eliminarBanco);  
    router.get('/bancos/listarTransacciones/:IdBanco', bancosController.listarTransacciones);

    //TRANSACCION
    router.post('/transacciones/crear', transaccionesController.create);
    router.put('/transacciones/anular/:noTransaccion',transaccionesController.anular)
    router.get('/transacciones/obtener/:noTransaccion',transaccionesController.listById);
    router.get('/transacciones/obtener',transaccionesController.list)
    router.get('/transacciones/obtenerPorServicio/:idServicio',transaccionesController.listByService)

    //FACTURAS
    router.get('/facturas/obtener/:noFactura',facturasController.getFacturaById)
    router.put('/facturas/anular/:noFactura',facturasController.anular)
    router.get('/facturas/obtener',facturasController.obtenerTodas)

    //DEVOLUCIONES
    router.post('/devoluciones/crear',devolucionesController.create)
    router.get('/devoluciones/obtener',devolucionesController.getAll)
    router.get('/devoluciones/obtener/:noDevolucion',devolucionesController.getById)

    //RETIROS
    // router.post('/retiros/crear', retirosController.create);



    app.use('/pagos', router)
};
