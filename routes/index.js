const { Router } = require('express');
const router = Router();
const bancosController = require('../controllers/bancosController')

router.post('/bancos/crear',bancosController.crearBanco);
router.get('/bancos/obtener',bancosController.obtenerBancos);
router.get('/bancos/obtener/:id',bancosController.obtenerBancoPorId);
router.put('/bancos/eliminar/:id',bancosController.eliminarBanco);

//RUTAS
module.exports = (app) => {
    app.use('/pagos/bancos', router)
};