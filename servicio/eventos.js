import ModelMongoDBEvento from "../model/DAO/eventosMongoDB.js";
import ModelMongoDBUsuario from "../model/DAO/usuariosMongoDB.js";
import axios from "axios";

class Servicio {
  constructor() {
    this.modelEvento = new ModelMongoDBEvento();
    this.modelUsuario = new ModelMongoDBUsuario();
  }

  obtenerEvento = async (id) => {
    const evento = await this.modelEvento.obtenerEvento(id);
    return evento;
  };

  obtenerEventos = async (categoria) => {
    const eventos = await this.modelEvento.obtenerEventos(categoria);
    return eventos;
  };

  obtenerEventosUsuario = async (id) => {
    const eventos = await this.modelEvento.obtenerEventosUsuario(id);
    return eventos;
  };

  obtenerClima = async (id) => {
    const evento = await this.modelEvento.obtenerEvento(id);

    const ciudad = evento.ciudad;
    const apiKey = "0194ea3482e0e589fe92a10f79156f66";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&lang=sp,es&appid=${apiKey}&units=metric`;

    try {
      const respuesta = await axios.get(url);
      const datosClima = await respuesta.data;

      const temperatura = datosClima.main.temp;
      const descripcion = datosClima.weather[0].description;

      evento.clima = {
        temperatura,
        descripcion,
      };

      return evento;
    } catch (error) {
      throw new Error(
        `Error al obtener el clima. Código de estado: ${respuesta.status}`
      );
    }
  };

  crearEvento = async (evento) => {
    const eventoGuardado = await this.modelEvento.crearEvento(evento);
    await this.modelUsuario.guardarEventoCreado(
      eventoGuardado.idUsuarioCreador,
      eventoGuardado._id
    );
    return eventoGuardado;
  };

  actualizarEvento = async (id, evento) => {
    const eventoActualizado = await this.modelEvento.actualizarEvento(
      id,
      evento
    );
    return eventoActualizado;
  };

  borrarEvento = async (id) => {
    const eventoBorrado = await this.modelEvento.borrarEvento(id);
    return eventoBorrado;
  };

  suscribirUsuario = async (id, idUsuario) => {
    const evento = await this.modelEvento.suscribirUsuario(id, idUsuario);
    await this.modelUsuario.guardarEventoSuscripto(idUsuario, id);
    return evento;
  };
}

export default Servicio;
