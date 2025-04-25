const Banco = require('../models/bancos')

exports.crearBanco = async (req, res) => {
try {
    const nuevoBanco = new Banco(req.body);
    console.log(nuevoBanco)
    await nuevoBanco.save();
    res.status(200).json({mensaje: 'Banco creado exitosamente'});
}
catch(error){
    res.status(500).json({mensaje: 'Error al crear el banco'});
}    
};
exports.obtenerBancos = async (req, res) => {
    try {
        const bancos = await Banco.find();
        res.json({Bancos: bancos});
    } catch (error){
        res.status(500).json({mensaje: 'Error al obtener los bancos'});
    }
};
exports.obtenerBancoPorId = async (req, res) => {
    try {
        const banco = await Banco.findById(req.params.id);
        res.json({Banco: banco});
    } catch (error){
        res.status(500).json({mensaje: 'Error al obtener el banco'})
    }
};
exports.eliminarBanco = async (req, res) => {
    try {
        const { id } = req.params;

        const banco = await Banco.findByIdAndUpdate(id, { estado: 0 }, {
            new: true
        });

        if (!banco) {
            return res.status(404).json({ mensaje: "Banco no encontrado" });
        }

        res.json({ mensaje: "Banco eliminado exitosamente"});
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el banco"});
    }
};

exports.listarTransacciones = async (req, res) => {
    const filtro = req.body.idMetodo; 
    try {
        const idBanco = req.params.IdBanco;
        const banco = await Banco.findById(idBanco);
        console.log(banco)
        if (!banco) {
            return res.status(404).json({ mensaje: "Banco no encontrado" });
        }

        // Si no se pasa un filtro, usar todas las transacciones
        const transaccionesBanco = filtro 
            ? banco.transacciones.filter(transaccion => 
                transaccion.metodosDePago.idMetodo === filtro
              )
            : banco.transacciones;

        let montoTotal = 0;
        console.log(transaccionesBanco)
        for (const element of transaccionesBanco) {
            montoTotal += parseFloat(element.metodosDePago.monto);
        }

        const objetoDevolver = {
            montoTotalBanco: montoTotal,
            transacciones: transaccionesBanco
        };

        res.status(200).json(objetoDevolver);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al listar las transacciones' });
    }
};