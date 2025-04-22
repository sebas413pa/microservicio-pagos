const { Router } = require('express');
const router = Router();

const metodo = require('../controllers/metodosController');
const cierre = require('../controllers/cierreController');
const clientesController = require('../controllers/clientesController')
const fidelidadController = require('../controllers/fidelidadController')

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

    // Cierre de caja
    router.post('/cierre/obtener', cierre.obtenerCierres); 
    router.post('/cierres/crear', cierre.create);

    app.use('/pagos', router)
};

