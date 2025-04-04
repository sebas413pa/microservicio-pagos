const { Router } = require('express');
const router = Router();

const metodo = require('../controllers/metodosController');
const clientesController = require('../controllers/clientesController')
const fidelidadController = require('../controllers/fidelidadController')

router.post('/metodos/crear', metodo.create);
router.put('/metodos/eliminar/:_id', metodo.eliminarMetodo);
router.get('/metodos/obtener', metodo.obtenerMetodosPago);
router.get('/metodos/obtener/:_id', metodo.obtenerMetodoPagoPorId);

module.exports = (app) => {
    app.use('/', router);
    
    //Clientes
    router.post('/cliente/crear', clientesController.create)
    router.get('/cliente/obtener', clientesController.list)
    router.get('/cliente/obtener/:nit', clientesController.buscarNit)
    router.put('/cliente/actualizar/:idCliente', clientesController.update)
    router.put('/cliente/eliminar/:idCliente', clientesController.delete)

    //Tarjeta fidelidad
    router.post('/cliente/fidelidad/crear/:idCliente', fidelidadController.agregar)
    router.put('/cliente/fidelidad/desactivar/:idCliente', fidelidadController.desactivar)


    app.use('/pagos', router)
};

