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

async function changeRol() {
  try {
    const response = await fetch("api/sessions/current");
    if (!response.ok) {
      throw new Error("Error al obtener el usuario actual");
    }

    const user = await response.json();
    const userId = user._id;
    console.log("user: " + user);
    const responseRol = await fetch(`/api/users/premium/${userId}`, {
      method: "PUT", // Cambiamos el método a PUT
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!responseRol.ok) {
      throw new Error("Error al cambiar el rol");
    }
    const rol = await responseRol.json();
    alert(
      "tu rol se ha cambiado, si no puedes ver el cambio, vuelve a iniciar sesion"
    );
    return rol;
  } catch (error) {
    console.error("Error al cambiar el rol:", error);
    // Manejar el error según tus necesidades (por ejemplo, mostrar una alerta)
    return null;
  }
}
