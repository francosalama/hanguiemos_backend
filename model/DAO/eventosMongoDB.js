import { ObjectId } from "mongodb";
import CnxMongoDB from "../DBMongo.js";

class ModelMongoDB {
  obtenerEvento= async (idEvento) => {
    if (!CnxMongoDB.connection) return {};

    const evento = await CnxMongoDB.db.collection("eventos").findOne({_id: new ObjectId(idEvento)});

    if (!evento) {
      return null;
    }

    return evento;
  };

  obtenerEventoUsuario = async (idEvento, idUsuario) => {
    if (!CnxMongoDB.connection) return {};

    const evento = await CnxMongoDB.db.collection("eventos").findOne({
      _id: new ObjectId(idEvento),
      suscriptores: {
        $elemMatch: { $eq: new ObjectId(idUsuario) },
      },
    });

    if (!evento) {
      return null;
    }

    return evento;
  };
  

  obtenerEventosUsuario = async (idUsuario) => {
    if (!CnxMongoDB.connection) return {};
    const eventos = await CnxMongoDB.db
      .collection("eventos")
      .find({ suscriptores: { $in: [new ObjectId(idUsuario)] } })
      .toArray();
    return eventos || [];
  };

  obtenerEventos = async (categoria) => {
    if (!CnxMongoDB.connection) return [];

    if (categoria) {
      const evento = await CnxMongoDB.db
        .collection("eventos")
        .find({ categoria: categoria })
        .toArray();
      return evento;
    } else {
      const eventos = await CnxMongoDB.db
        .collection("eventos")
        .find({})
        .toArray();
      return eventos;
    }
  };

  obtenerEventosInteresados = async (intereses) => {
    if (!CnxMongoDB.connection) return [];

    const eventos = await CnxMongoDB.db
      .collection("eventos")
      .find({ categoria: { $in: intereses } })
      .toArray();
    return eventos;
  };

  crearEvento = async (evento) => {
    if (!CnxMongoDB.connection) return {};

    evento.idUsuarioCreador = new ObjectId(evento.idUsuarioCreador);
    evento.suscriptores = [new ObjectId(evento.idUsuarioCreador)];

    await CnxMongoDB.db.collection("eventos").insertOne(evento);
    return evento;
  };

  actualizarEvento = async (idEvento, evento, idUsuario) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db
      .collection("eventos")
      .updateOne({ _id: new ObjectId(idEvento) }, { $set: evento });

    const eventosActualizado = await this.obtenerEventoUsuario(
      idEvento,
      idUsuario
    );
    return eventosActualizado;
  };

  suscribirUsuario = async (idEvento, idUsuario) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db
      .collection("eventos")
      .updateOne(
        { _id: new ObjectId(idEvento) },
        { $push: { suscriptores: { $each: [new ObjectId(idUsuario)] } } }
      );

    const evento = await this.obtenerEventoUsuario(idEvento, idUsuario);
    return evento;
  };

  desuscribirUsuario = async (idEvento, idUsuario) => {
    if (!CnxMongoDB.connection) return {};
    const evento = await this.obtenerEventoUsuario(idEvento, idUsuario);

    await CnxMongoDB.db
      .collection("eventos")
      .updateOne(
        { _id: new ObjectId(idEvento) },
        { $pull: { suscriptores: new ObjectId(idUsuario) } }
      );

    return evento;
  };

  borrarEvento = async (idEvento, idUsuario) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db.collection("eventos").deleteOne({
      _id: new ObjectId(idEvento),
      idUsuarioCreador: new ObjectId(idUsuario),
    });

    const eventos = await this.obtenerEventosUsuario(idUsuario);

    return eventos;
  };
}

export default ModelMongoDB;
