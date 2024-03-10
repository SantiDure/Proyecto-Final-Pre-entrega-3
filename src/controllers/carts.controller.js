import { cartsManager } from "../dao/cart.dao.mongoose.js";
import { cartService, ticketService, userService } from "../services/index.js";
import { productService } from "../services/index.js";

export async function getTicketController(req, res) {
  const { cid } = req.params;
  try {
    // Obtiene el carrito y el usuario correspondiente a ese carrito
    const cart = await cartService.getCartByIdService({ _id: cid });
    const user = await userService.getUsersService({ cart: cid });

    // Crea una lista de productos, la rellena y lo muestra por consola
    let productList = [];

    // Array para almacenar los IDs de los productos que no se pudieron comprar
    let outOfStockProducts = [];

    // Añade la cantidad y los productos a productList y comprueba el stock
    await Promise.all(
      cart.products.map(async (product) => {
        const productsFounded = await productService.getProductByIdService(
          product._id
        );
        if (productsFounded.stock >= product.quantity) {
          // Si hay suficiente stock, resta la cantidad comprada al stock del producto
          await productService.updateOneService(product._id, {
            stock: productsFounded.stock - product.quantity,
          });
          productsFounded.quantity = product.quantity;
          productList.push(productsFounded);
        } else {
          // Si no hay suficiente stock, agrega el ID del producto al array de productos sin stock
          outOfStockProducts.push(product._id);
        }
      })
    );

    // Filtra el carrito original para quedarse solo con los productos sin stock
    const newCart = {
      ...cart,
      products: cart.products.filter((product) =>
        outOfStockProducts.includes(product._id)
      ),
    };

    // Actualiza el carrito en la base de datos
    await cartService.updateOneService(cid, newCart);
    // Calcula el total gastado en la compra
    const total = productList.reduce(
      (accumulator, currentProduct) =>
        accumulator + currentProduct.price * currentProduct.quantity,
      0
    );
    // Instancia el ticket
    const ticket = await ticketService.createTicketService({
      amount: total,
      purchaser: user[0].email,
    });
    // Retorna el ticket generado y el array de IDs de productos sin stock
    res.status(200).send({ ticket, outOfStockProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCartsController(req, res) {
  let limit = req.query.limit;
  const data = await cartService.getCartsService({});
  try {
    if (!limit) {
      return res.json(data);
    }
    let limitedCarts = data.slice(0, limit);
    return res.status(200).json(limitedCarts);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function getCartByIdController(req, res) {
  const { cid } = req.params;
  try {
    const cartForId = await cartService
      .getCartByIdService({ _id: cid })
      .populate("products._id");

    return res.status(200).json({ cartForId });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function postAddProductToCartController(req, res) {
  const { cid, pid } = req.params;
  try {
    const userEmail = req.user.email;
    console.log(`email del usuario: ${userEmail}`);
    const product = await productService.getProductByIdService(pid);
    console.log(`owner del producto: ${product.owner}`);
    const productOwner = await product.owner;
    if (userEmail !== productOwner) {
      await cartsManager.addProductToCart(cid, pid);
      return res.status(201).json({ status: "ok" });
    } else {
      return res.status(401).json({ status: "error", message: error.message });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function postCartController(req, res) {
  try {
    const cart = await cartService.createCartService(req.body);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function deleteCartController(req, res) {
  const { cid } = req.params;
  try {
    await cartService.updateOneService(cid, { products: [] });
    res.json(req.body);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function deleteManyCartController(req, res) {
  try {
    await cartService.deleteManyService({});
    res.json(req.body);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function deleteProductOnCartController(req, res) {
  const { cid, pid } = req.params;
  try {
    const cart = await cartService.getCartByIdService(cid);
    const product = await productService.getProductByIdService(pid);
    if (!cart || !product) {
      res.status(404).send({
        message: "el producto o el carrito no fueron encontrados",
      });
    } else {
      await cartsManager.deleteProductOnCart(cid, pid);
      res.status(200).send(`product deleted id: ${pid}`);
    }
  } catch (error) {
    res.status(500);
  }
}

export async function updateCartController(req, res) {
  const { cid } = req.params;

  try {
    await cartService.updateOneService(cid, { products: [] });
    await cartService.updateOneService(cid, { products: req.body });
    res.json(cid);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function updateProductQuantityOnCartController(req, res) {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartService.getCartByIdService(cid);

    const product = await productService.getProductByIdService(pid);

    const updateCart = await cartService.updateOneService(
      {
        _id: cart._id,
        "products._id": product._id,
      },
      {
        $set: {
          "products.$.quantity": quantity,
        },
      }
    );

    if (updateCart) {
      return res.status(200).send("Cantidad actualizada");
    } else {
      return res.status(400).send("No se pudo actualizar la cantidad");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error interno del servidor");
  }
}
