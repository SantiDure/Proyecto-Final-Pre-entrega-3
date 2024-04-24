const usersContainer = document.querySelector(".users");

async function getUsers() {
  const response = await fetch("/api/users");
  const users = await response.json();
  if (!response.ok) {
    alert("ocurrió un error al buscar usuarios");
  }
  users.payload.forEach((user) => {
    const card = createUserCard(user);
    usersContainer.appendChild(card);
  });
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
  //botones

  divCard.appendChild(divContainer);

  return divCard;
}

getUsers();
/*<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div> */
