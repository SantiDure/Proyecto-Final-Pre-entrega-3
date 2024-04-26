import { cartService, userService } from "../services/index.js";
import { hashear } from "../utils/criptograph.js";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import { gmailEmailService } from "../services/email.service.js";

export async function getUsersController(req, res) {
  try {
    const users = await userService.getUsersService({});
    return res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

export async function postDocumentsController(req, res) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const typeOfDocument = req.params.typeofdocument;
    if (!req.file) {
      res.status(400).json({ status: "error", message: "falta archivo" });
    }
    if (!req.body.docName) {
      res.status(400).json({ status: "error", message: "falta BODY" });
    }
    const newDoc = {
      name: req.body.docName,
      reference: path.join(
        __dirname,
        `../uploads/${typeOfDocument}/${req.file.originalname}`
      ),
    };
    await userService.updateOneService(uid, { $push: { documents: newDoc } });
    res.status(200).json({ status: "success", message: "archivo subido" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error de servidor", message: error.message });
  }
}

export async function postUserController(req, res) {
  try {
    req.body.password = hashear(req.body.password);
    const user = await userService.createUserService(req.body);

    res.status(201).json({
      status: "success",
      payload: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getUserController(req, res) {
  //debe comprobar que existe un token para devolver la informacion del usuario
  passport.authenticate("jwt", { failWithError: true });
  return res.json({ status: "success", payload: req.user });
}

export async function putUserController(req, res) {
  try {
    if (req.body.password) {
      req.body.password = hashear(req.body.password);
    }

    const updated = await userService.updateOneService(req.user._id, {
      $set: req.body,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ status: "error", message: "usuario no encontrado" });
    }

    res.json({ status: "success", payload: updated });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
}

export async function deleteInactiveController(req, res) {
  try {
    // dos días
    const twoDaysAgo = new Date(Date.now() - 2 * 60 * 1000);
    // Elimina los usuarios que no se han actualizado en los últimos dos días
    // 2 * 24 * 60 * 60 * 1000
    const usersToSendMail = await userService.getUsersService({
      last_connection: { $lt: twoDaysAgo },
    });
    usersToSendMail.map(async (user) => {
      await gmailEmailService.send(
        user.email,
        "Vuelve pronto!",
        "Tu cuenta fue eliminada de nuestra tienda, por estar mucho tiempo inactiva, esperamos que vuelvas pronto!"
      );
    });
    const result = await userService.deleteInactiveService({
      last_connection: { $lt: twoDaysAgo },
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron usuarios inactivos",
      });
    }
    return res.status(200).json({
      status: "success",
      message: `Se eliminaron
       ${result.deletedCount}
       usuarios inactivos`,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

export async function deleteUserByIdController(req, res) {
  const { uid } = req.params;
  try {
    const deletedUser = await userService.deleteOneService(uid);
    if (!deletedUser) {
      return res.status(404).json({ status: "error", message: "not found" });
    }
    return res.status(200).json({ status: "success", deletedUser });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

export async function changeRolUserAndPremiumController(req, res) {
  const { uid } = req.params;
  const user = await userService.getUserByIdService({ _id: uid });

  try {
    if (user.rol === "user") {
      user.rol = "premium";
    } else if (user.rol === "premium") {
      user.rol = "user";
    }

    const updated = await userService.updateOneService(uid, {
      $set: { rol: user.rol },
    });

    return res.status(200).json({ status: "success", payload: updated });
  } catch (error) {
    return res.status(404).json({ status: "error", message: error.message });
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { uid } = req.params;
    const newPassword = req.body.newPassword;
    const user = await userService.updateOneService(uid, {
      $set: { password: hashear(newPassword) },
    });
    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
}
