const Banco = require('../models/bancos')

exports.crearBanco = async (req, res) => {
try {
    const nuevoBanco = new Banco(req.body);
    await nuevoBanco.save();
    res.status(200).json({mensaje: 'Banco creado exitosamente', banco: nuevoBanco});
}
catch(error){
    res.status(500).json({mensaje: 'Error al crear el banco', error: error.message});
}    
};
exports.obtenerBancos = async (req, res) => {
    try {
        const bancos = await Banco.find();
        res.json({Bancos: bancos});
    } catch (error){
        res.status(500).json({mensaje: 'Error al obtener los bancos'}, error);
    }
};
exports.obtenerBancoPorId = async (req, res) => {
    try {
        const banco = await Banco.findById(req.params.id);
        res.json({Banco: banco});
    } catch (error){
        res.status(500).json({mensaje: 'Error al obtener el banco'}, error)
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

        res.json({ mensaje: "Banco eliminado exitosamente", Banco: banco });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el banco", error: error.message });
    }
};
