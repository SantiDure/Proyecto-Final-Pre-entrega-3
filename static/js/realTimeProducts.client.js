const socket = io();

export async function getProducts() {
  const listaProductos = document.querySelector(".listaProductos");
  const response = await fetch("/api/products");
  const products = await response.json();

  if (products[0]) {
    listaProductos.innerHTML = "";
    products.map((product) => {
      let divProduct = document.createElement("div");
      divProduct.innerHTML = `         
                 <div class="card" style="width: 18rem;">
                   <div class="card-body">
                     <h5 class="card-title">${product.title}</h5>
                     <h6 class="card-subtitle mb-2 text-body-secondary">Descripcion: ${product.description}</h6>
                     <p class="card-text">Stock disponible: ${product.stock}</p>
                   </div>
                 </div>`;
      listaProductos.appendChild(divProduct);
    });
  } else {
    listaProductos.innerHTML = `
  <div>NO HAY PROD</div>`;
  }
}
//////

const form = document.querySelector("form");
const productList = document.querySelector(".listaProductos");

getProducts();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.querySelector("#title").value;
  const description = document.querySelector("#description").value;
  const code = document.querySelector("#code").value;
  const price = document.querySelector("#price").value;
  const stock = document.querySelector("#stock").value;
  const category = document.querySelector("#category").value;
  const thumbnail = document.querySelector("#thumbnail").value;
  //obteniendo el owner
  const user = await fetch("/api/users/current");
  const userJson = await user.json();
  const ownerId = userJson.payload.email;

  // Validations
  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !stock ||
    !category ||
    !thumbnail ||
    !ownerId
  ) {
    Swal.fire({
      title: "Error!",
      text: "Datos Invalidos",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  socket.emit(
    "addProduct",
    {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail,
    },
    ownerId
  );
  form.reset();
});

socket.on("getProducts", async () => {
  const listaProductos = document.querySelector(".listaProductos");
  listaProductos.innerHTML = ""; // Limpiamos la lista antes de actualizarla

  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }

    const products = await response.json();

    if (products) {
      products.payload.forEach((product) => {
        let divProduct = document.createElement("div");
        divProduct.innerHTML = `         
                   <div class="card" style="width: 18rem;">
                     <div class="card-body">
                       <h5 class="card-title">${product.title}</h5>
                       <h6 class="card-subtitle mb-2 text-body-secondary">Descripcion: ${product.description}</h6>
                       <p class="card-text">Stock disponible: ${product.stock}</p>
                       <p class="card-text">Owner: ${product.owner}</p>
                      <div class="btn__delete__container"></div>
                     </div>
                   </div>`;
        listaProductos.appendChild(divProduct);

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar producto";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.addEventListener("click", async () => {
          const productID = product._id;
          const user = await fetch("/api/users/current");
          const userJson = await user.json();

          switch (userJson.payload.rol) {
            case "admin":
              if (productID) {
                socket.emit("deleteProduct", productID);
              }
              break;
            case "premium":
              if (product.owner !== userJson.payload.email) {
                alert("Solo puedes eliminar productos que tú creaste");
              } else {
                if (productID) {
                  socket.emit("deleteProduct", productID);
                }
              }
              break;
          }
        });
        divProduct
          .querySelector(".btn__delete__container")
          .appendChild(deleteButton);
      });
    }
  } catch (error) {
    console.error(error.message);
    listaProductos.innerHTML = `<div>Error al obtener productos. Por favor, inténtalo de nuevo más tarde.</div>`;
  }
});
