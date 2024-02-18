import { ErrorType, newError } from "../../src/errors/errors";

function irAPag(limit) {
  const pagDeseada = document.querySelector("input").value || 1;
  window.location = `/products?limit=${limit}&page=${pagDeseada}`;
}
let idcarrito = document.querySelector("#id-carrito").innerText;

async function agregarAlCarrito(productoId) {
  return new Promise((resolve, reject) => {
    fetch(`api/carts/${idcarrito}/product/${productoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw newError(ErrorType.NOT_FOUND, "Error al agregar al carrito");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        alert("Producto agregado al carrito");
        resolve(data); // Resuelve la promesa con los datos obtenidos
      })
      .catch((error) => {
        reject(error); // Rechaza la promesa con el error obtenido
      });
  });
}
