import { userService } from "../services/index.js";
import { hashear } from "../utils/criptograph.js";
import passport from "passport";

export async function postDocumentsController(req, res) {
  if (!req.file) {
    res.status(400).json({ status: "error", message: "falta archivo" });
  }
  res.status(200).json({ status: "success", message: "archivo subido" });
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

    const updated = await userService.updateOneService(
      { email: req.body.email },
      { $set: req.body },
      { new: true }
    );

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

export async function deleteUserController(req, res) {
  const { id } = req.params;
  try {
    return await userService.deleteOneService(id);
  } catch (error) {
    res.status(404).json({ status: "error", message: error.messaje });
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
    res.status(404).json({ status: "error", message: error.message });
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { uid } = req.params;
    const newPassword = req.body.newPassword;
    const user = await userService.updateOneService(uid, {
      $set: { password: hashear(newPassword) },
    });
    res
      .status(200)
      .json({ message: "Contraseña actualizada correctamente", newPassword });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
}
