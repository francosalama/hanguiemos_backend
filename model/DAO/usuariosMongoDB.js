import { ObjectId } from "mongodb";
import CnxMongoDB from "../DBMongo.js";

class ModelMongoDB {
  registrarUsuario = async (usuario) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db.collection("usuarios").insertOne(usuario);
    return usuario;
  };

  obtenerUsuarioPorMail = async (mail) => {
    if (!CnxMongoDB.connection) return {};
    const usuario = await CnxMongoDB.db
      .collection("usuarios")
      .findOne({ mail: mail });
    return usuario;
  };

  obtenerUsuarioPorId = async (idUsuario) => {
    if (!CnxMongoDB.connection) return {};
    const usuario = await CnxMongoDB.db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(idUsuario) });
    return usuario;
  };

  actualizarUsuario = async (idUsuario, usuario) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db
      .collection("usuarios")
      .updateOne({ _id: new ObjectId(idUsuario) }, { $set: usuario });

    const usuarioActualizado = await this.obtenerUsuarioPorId(idUsuario);
    return usuarioActualizado;
  };

  guardarEventoCreado = async (id, idEvento) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db
      .collection("usuarios")
      .updateOne(
        { _id: id },
        { $push: { eventosCreados: { $each: [idEvento] } } }
      );
  };

  guardarEventoSuscripto = async (id, idEvento) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db
      .collection("usuarios")
      .updateOne(
        { _id: new ObjectId(id) },
        { $push: { eventosSuscriptos: { $each: [new ObjectId(idEvento)] } } }
      );
  };

  eliminarEventoSuscripto = async (id, idEvento) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db
      .collection("usuarios")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { eventosSuscriptos: new ObjectId(idEvento) } }
      );
  };

  eliminarEventoCreado = async (id, idEvento) => {
    if (!CnxMongoDB.connection) return {};

    await CnxMongoDB.db
      .collection("usuarios")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { eventosCreados: new ObjectId(idEvento) } }
      );
  };
}

export default ModelMongoDB;
