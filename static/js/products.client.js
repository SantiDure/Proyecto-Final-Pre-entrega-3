function irAPag(limit) {
  const pagDeseada = document.querySelector("input").value || 1;
  window.location = `/products?limit=${limit}&page=${pagDeseada}`;
}
let idcarrito = document.querySelector("#id-carrito").innerText;

async function agregarAlCarrito(productoId) {
  try {
    const response = await fetch(
      `api/carts/${idcarrito}/product/${productoId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      alert("Error al agregar al carrito");
      return; // Salimos de la función si hay un error
    }

    const data = await response.json();
    alert("Producto agregado al carrito");
    return data; // Resolvemos la promesa con los datos obtenidos
  } catch (error) {
    alert("Error al agregar al carrito");
    throw error; // Rechazamos la promesa con el error obtenido
  }
}
