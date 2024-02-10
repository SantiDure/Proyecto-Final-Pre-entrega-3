const formResetPassword = document.querySelector(".resetpassword__form");

formResetPassword?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/api/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(new FormData(formResetPassword)),
  });

  if (response.status === 200) {
    alert("contraseña reestablecida");
    window.location.href = "/login";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});
