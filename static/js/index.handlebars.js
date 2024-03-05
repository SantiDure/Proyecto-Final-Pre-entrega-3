async function getProducts() {
  const listaProductos = document.querySelector(".listaProductos");
  const response = await fetch("/api/products");
  const products = await response.json();

  if (products[0]) {
    console.log(products.payload);
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

getProducts();
