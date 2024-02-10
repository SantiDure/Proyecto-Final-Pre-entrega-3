const form = document.querySelector(".form__messages");
const messagesContainer = document.querySelector(".messages__container");

const socket = io();

//Pedido de nombre al usuario
const nombreUsuario = prompt("Escribe tu nombre");
const emailUsuario = prompt("Escribe tu email");

/////Eventos
form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = document.querySelector(".input__message").value;
  // Validations
  if (!message) {
    Swal.fire({
      title: "Error!",
      text: "No puedes enviar un mensaje vacio",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  socket.emit("addMessage", {
    nombreUsuario,
    emailUsuario,
    message,
  });
  form.reset();
});

socket.on("getMessages", async () => {
  const messagesContainer = document.querySelector(".messages__container");
  const response = await fetch("/api/messages");
  const messages = await response.json();

  messagesContainer.innerHTML = "";

  if (messages[0]) {
    messages.map((message) => {
      let divMessage = document.createElement("div");
      divMessage.innerHTML = `         
                     <div class="card" style="width: 18rem;">
                       <div class="card-body">
                         <p class="card-text">${message.user}: ${message.content}</p>
                       </div>
                     </div>`;
      messagesContainer.appendChild(divMessage);
    });
  } else {
    messagesContainer.innerHTML = `
    <div>NO HAY MENSAJES</div>`;
  }
});
