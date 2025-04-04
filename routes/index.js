const { Router } = require('express');
const router = Router();
const bancosController = require('../controllers/bancosController')

router.post('/crear',bancosController.crearBanco);
router.get('/obtener',bancosController.obtenerBancos);
router.get('/obtener/:id',bancosController.obtenerBancoPorId);
router.put('/eliminar/:id',bancosController.eliminarBanco);

//RUTAS
module.exports = (app) => {
    app.use('/pagos/bancos', router)
};