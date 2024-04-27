const formLogout = document.querySelector(".logoutform");
const btn_change__rol = document.querySelector(".cambiar__rol");
formLogout?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/api/sessions/current", {
    method: "DELETE",
  });

  if (response.status === 204) {
    window.location.href = "/login";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});

async function resetPassword(token) {
  try {
    const response = await fetch(`/api/sessions/resetpassword/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al reestablecer la contraseña");
    } else {
      //DEBE ENVIAR UN MAIL, CON UN BOTON, QUE REDIRIJA A LA PAGINA PARA RESETAR LA CONTRASEÑA
      try {
        const emailResponse = await fetch(`/api/sendButtonMail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (emailResponse.ok) {
          alert(
            "Revisa tu email para seguir con el proceso de reestablecimiento de tu contraseña"
          );
        }
      } catch (error) {
        throw new Error("Error relacionado a nodemailer", error.message);
      }
    }
  } catch (error) {
    throw new Error(error.message);
    // Maneja el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
  }
}
