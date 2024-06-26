import Servicio from "../servicio/eventos.js";


class Controlador {
  constructor() {
    this.servicio = new Servicio();
  }

  obtenerEvento = async (req, res) => {
    const {id: idEvento} = req.params;
    const eventos = await this.servicio.obtenerEvento(idEvento);
    res.json(eventos);
  };

  obtenerEventoUsuario = async (req, res) => {
    const idUsuario = req.usuario.id;
    const {id: idEvento} = req.params;
    const eventos = await this.servicio.obtenerEventoUsuario(idUsuario, idEvento);
    res.json(eventos);
  };

  obtenerEventosUsuario = async (req, res) => {
    const idUsuario = req.usuario.id;
    const eventos = await this.servicio.obtenerEventosUsuario(idUsuario);
    res.json(eventos);
  };

  obtenerEventos = async (req, res) => {
    const { categoria } = req.query;
    const eventos = await this.servicio.obtenerEventos(categoria);
    res.json(eventos);
  };

  obtenerEventosInteresados = async (req, res) => {
    const idUsuario = req.usuario.id;
    const eventos = await this.servicio.obtenerEventosInteresados(idUsuario);
    res.json(eventos);
  };

  obtenerClima = async (req, res) => {
    const idUsuario = req.usuario.id;
    const { id: idEvento } = req.params;
    const clima = await this.servicio.obtenerClima(idEvento, idUsuario);
    if (clima.error) {
      return res.status(500).json(clima)
    }
    res.json(clima);
  };

  crearEvento = async (req, res) => {
    const evento = req.body;
    const idUsuario = req.usuario.id;
    try {
      const eventoGuardado = await this.servicio.crearEvento(evento, idUsuario);
      res.json(eventoGuardado);
    }
    catch (error) {
      res.status(500).json({ error: error.message })
    }
  };

  actualizarEvento = async (req, res) => {
    const idUsuario = req.usuario.id
    const { id: idEvento } = req.params;
    const evento = req.body;
    try {
      const eventoActualizado = await this.servicio.actualizarEvento(idEvento, evento, idUsuario);
      res.json(eventoActualizado);
    }
    catch (error) {
      res.status(500).json({ error: error.message })
    }
  };

  borrarEvento = async (req, res) => {
    const {id: idEvento} = req.params;
    const idUsuario = req.usuario.id;
    const eventoBorrado = await this.servicio.borrarEvento(idEvento, idUsuario);
    res.json(eventoBorrado);
  };

  suscribirUsuario = async (req, res) => {
    const {id: idEvento} = req.params;
    const idUsuario = req.usuario.id;
    const evento = await this.servicio.suscribirUsuario(idEvento, idUsuario);
    if (evento.error) {
      return res.status(500).json(evento)
    }
    res.json(evento);
  };

  desuscribirUsuario = async (req, res) => {
    const {id: idEvento} = req.params;
    const idUsuario = req.usuario.id;
    const evento = await this.servicio.desuscribirUsuario(idEvento, idUsuario);
    if (evento.error) {
      return res.status(500).json(evento)
    }
    res.json(evento);
  };
}

export default Controlador;
