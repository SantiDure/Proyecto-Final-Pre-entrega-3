import { userService } from "../services/index.js";
import { hashear } from "../utils/criptograph.js";
import passport from "passport";
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
