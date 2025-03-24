const { Router } = require('express');
const router = Router();

const metodo = require('../controllers/metodosController');

router.post('/pagos/metodos/crear', metodo.create);
router.put('/pagos/metodos/eliminar/:_id', metodo.eliminarMetodo);
router.get('/pagos/metodos/obtener', metodo.obtenerMetodosPago);
router.get('/pagos/metodos/obtener/:_id', metodo.obtenerMetodoPagoPorId);

module.exports = (app) => {
    app.use('/', router);
    
};

