const { Router } = require('express');
const router = Router();

const clientesController = require('../controllers/clientesController')
const fidelidadController = require('../controllers/fidelidadController')



//RUTAS
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


    app.use('/pagos', router)
};
