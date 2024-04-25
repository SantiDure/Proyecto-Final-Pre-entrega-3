const usersContainer = document.querySelector(".users");
const btnDeleteInactive = document.querySelector("#btn__delte_inactive");

async function getUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Ocurrió un error al buscar usuarios");
    }
    const users = await response.json();
    users.payload.forEach((user) => {
      const card = createUserCard(user);
      usersContainer.appendChild(card);
    });
    // Ahora agregamos el event listener después de agregar todos los usuarios
    const btnsDeleteUser = document.querySelectorAll(".delete-user");
    btnsDeleteUser.forEach((btn) => {
      btn.addEventListener("click", () => {
        const userId = btn.getAttribute("data-user-id");
        deleteUser(userId);
      });
    });

    const btnsChangeUserRole = document.querySelectorAll(".change-role");
    btnsChangeUserRole.forEach((btn) => {
      btn.addEventListener("click", () => {
        const userId = btn.getAttribute("data-user-id");
        changeUserRole(userId);
      });
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al buscar usuarios");
  }
}
async function changeUserRole(userId) {
  try {
    const response = await fetch(`/api/users/premium/${userId}`, {
      method: "PUT",
    });
    if (response.ok) {
      alert("El cambio de rol fue exitoso");
      location.reload(); // Recarga la página
    } else {
      throw new Error("Hubo un problema al cambiar el rol del usuario");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("La eliminación fue exitosa");
      location.reload(); // Recarga la página
    } else {
      throw new Error("Hubo un problema al eliminar el usuario");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function createUserCard(user) {
  const divCard = document.createElement("div");
  divCard.classList.add("card");

  const divContainer = document.createElement("div");
  divContainer.classList.add("card-body");

  const name = document.createElement("h5");
  name.classList.add("card-title");
  name.innerText = user.first_name + " " + user.last_name;
  divContainer.appendChild(name);

  const email = document.createElement("p");
  email.classList.add("card-text");
  email.innerText = user.email;
  divContainer.appendChild(email);

  const rol = document.createElement("p");
  rol.classList.add("card-text");
  rol.innerText = user.rol;
  divContainer.appendChild(rol);

  const last_connection = document.createElement("p");
  last_connection.classList.add("card-text");
  last_connection.innerText = user.last_connection;
  divContainer.appendChild(last_connection);

  // Botón de eliminar
  const btnDeleteUser = document.createElement("button");
  btnDeleteUser.classList.add("btn");
  btnDeleteUser.classList.add("btn-danger");
  btnDeleteUser.classList.add("user__button");
  btnDeleteUser.classList.add("delete-user");
  btnDeleteUser.setAttribute("data-user-id", user._id);
  btnDeleteUser.innerText = "Eliminar";
  divContainer.appendChild(btnDeleteUser);
  // Botón para cambiar el rol
  const btnChangeRol = document.createElement("button");
  btnChangeRol.classList.add("btn");
  btnChangeRol.classList.add("btn-primary");
  btnChangeRol.classList.add("user__button");
  btnChangeRol.classList.add("change-role");
  btnChangeRol.setAttribute("data-user-id", user._id);
  btnChangeRol.innerText = "Cambiar rol";
  divContainer.appendChild(btnChangeRol);

  divCard.appendChild(divContainer);

  return divCard;
}

btnDeleteInactive.addEventListener("click", async () => {
  try {
    const response = await fetch(`/api/users`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert(
        "Los usuarios con al menos 2 días de inactividad han sido eliminados"
      );
      location.reload();
    } else if (response.status == 404) {
      alert("No se encontraron usuarios para eliminar");
    } else {
      alert("ocurrio un error");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

getUsers();
