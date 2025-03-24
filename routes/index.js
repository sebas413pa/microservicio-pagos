const { Router } = require('express');
const router = Router();

const clientesController = require('../controllers/clientesController')



//RUTAS
module.exports = (app) => {
    //Clientes
    router.post('/cliente/crear', clientesController.create)
    router.get('/cliente/obtener', clientesController.list)
    


    app.use('/pagos', router)
};
