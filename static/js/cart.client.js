const cartContainer = document.querySelector("#productsAdded");
const btnBuy = document.querySelector("#btn_buy");
async function getCartId() {
  const response = await fetch(`/api/users/current`);
  const user = await response.json();
  const cartId = user.payload.cart._id;
  return cartId;
}

async function getCart() {
  let idCart = await getCartId();

  const response = await fetch(`/api/carts/${idCart}`);
  const result = await response.json();
  if (!response.ok) {
    alert("error");
  } else {
    const products = result.cartForId.products;

    products.map((product) => {
      const divCardProduct = document.createElement("div");
      divCardProduct.classList.add("card");

      const divContainer = document.createElement("div");
      divContainer.classList.add("card-body");

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.innerText = product._id.title;
      divContainer.appendChild(title);

      const quantity = document.createElement("p");
      quantity.classList.add("card-text");
      quantity.innerText = product.quantity;
      divContainer.appendChild(quantity);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn");
      deleteButton.classList.add("btn-danger");
      deleteButton.innerText = "quitar";
      deleteButton.addEventListener("click", async () => {
        const response = await fetch(
          `/api/carts/${idCart}/products/${product._id._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("producto quitado del carrito");
          location.reload();
        }
      });
      divContainer.appendChild(deleteButton);
      divCardProduct.appendChild(divContainer);

      cartContainer.appendChild(divCardProduct);
    });

    btnBuy?.addEventListener("click", async () => {
      const response = await fetch(`/api/carts/${idCart}/purchase`);
      const result = await response.json();
      if (!response.ok) {
        alert("error al generar el ticket");
      }
      //esto debe enviarse por mail al admin
      alert(
        "Finalizaste tu compra, aqui tienes el identificador de tu ticket de compra, guardalo o tomale una foto"
      );
      alert(result.ticket._id);
      location.reload();
    });
  }
}

getCart();
