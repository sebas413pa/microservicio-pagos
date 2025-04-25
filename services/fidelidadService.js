const Cliente = require('../models/clientes');

async function sumarPuntos(idCliente, puntos) {
  try {
    const cliente = await Cliente.findOne({ _id: idCliente, estado: 1 });
    console.log("Cliente tarjeta, ", cliente)
    if (!cliente) {
      return { ok: false, mensaje: "Cliente no encontrado" };
    }

    const cantidadTarjetas = cliente.tarjetaFidelidad.length;

    
    if(cliente.tarjetaFidelidad[cantidadTarjetas-1].estado == 0){
        return { ok: false, mensaje: "El cliente no tiene una tarjeta de fidelidad activa o vigente" };
    }

    const tarjetaActiva = cliente.tarjetaFidelidad[cantidadTarjetas-1]

    const nuevaCantidad = (tarjetaActiva.cantidadPuntos || 0) + puntos;

    await Cliente.updateOne(
      { _id: idCliente, "tarjetaFidelidad.noTarjeta": tarjetaActiva.noTarjeta },
      { $set: { "tarjetaFidelidad.$.cantidadPuntos": nuevaCantidad } }
    );

    return { ok: true, mensaje: "Puntos sumados correctamente" };
  } catch (error) {
    console.error("Error al sumar puntos:", error);
    return { ok: false, mensaje: "Error interno al sumar puntos" };
  }
}

async function restarPuntos(idCliente, puntos) {
  try {
    const cliente = await Cliente.findOne({ _id: idCliente, estado: 1 });
    console.log("Cliente tarjeta, ", cliente)
    if (!cliente) {
      console.log("asdfgh");
      return { ok: false, mensaje: "Cliente no encontrado" };
      
    }

    const cantidadTarjetas = cliente.tarjetaFidelidad.length;
    console.log(cantidadTarjetas)

    console.log(cliente.tarjetaFidelidad[cantidadTarjetas-1])

    
    if(cliente.tarjetaFidelidad[cantidadTarjetas-1].estado == 0){
        return { ok: false, mensaje: "El cliente no tiene una tarjeta de fidelidad activa o vigente" };
    }

    const tarjetaActiva = cliente.tarjetaFidelidad[cantidadTarjetas-1]
    console.log("Tarjeta activa: ", tarjetaActiva)
    let puntosGastar = puntos * 10;
    console.log(puntosGastar);
    if(tarjetaActiva.cantidadPuntos >= puntosGastar)
    {
      const nuevaCantidad = (tarjetaActiva.cantidadPuntos) - puntosGastar;
      console.log("Nueva cantidad de puntos ", nuevaCantidad)
      await Cliente.updateOne(
        { _id: idCliente, "tarjetaFidelidad.noTarjeta": tarjetaActiva.noTarjeta },
        { $set: { "tarjetaFidelidad.$.cantidadPuntos": nuevaCantidad } }
      );
      return { ok: true, mensaje: "Puntos canjeados correctamente" };
    }
    else {
      return { ok: false, mensaje: "Puntos no disponibles" };
    }
  } catch (error) {
    console.error("Error al canjear puntos:", error);
    return { ok: false, mensaje: "Error interno al canjear puntos" };
  }
}


module.exports = {
  sumarPuntos,
  restarPuntos
};
