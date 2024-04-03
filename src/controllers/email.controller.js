import { gmailEmailService } from "../services/email.service.js";

export async function sendButtonMailController(req, res) {
  await gmailEmailService.send(
    req.user.email,
    "reestablece tu contraseña",
    ` <div>
      <h1>Toca el boton y coloca una nueva contraseña</h1>
      <a href="http://localhost:8080/resetpassword">
        <button style="background-color: #008CBA; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">
          reset password
        </button>
      </a>
    </div>
    `
  );
}
