import { Router } from "express";
import {
  onlyAdmin,
  onlySessionActive,
  onlyUser,
} from "../../middlewares/autorizaciones.js";
import { productsManager } from "../../dao/product.dao.mongoose.js";
import { cartService } from "../../services/index.js";
import { logger } from "../../utils/logger.js";
export const webRouter = Router();

webRouter.get("/", (req, res) => {
  res.redirect("/login");
});

webRouter.get("/resetpassword", (req, res) => {
  res.render("resetpassword.handlebars", { title: "RESET PASSWORD" });
});

webRouter.get("/signup", (req, res) => {
  res.render("signup.handlebars", { title: "CREATE ACCOUNT" });
});
webRouter.get("/login", (req, res) => {
  res.render("login.handlebars", { title: "LOGIN" });
});
webRouter.get("/profile", onlySessionActive, (req, res) => {
  res.render("profile.handlebars", {
    title: "PROFILE INFORMATION",
    ...req.user,
  });
});
webRouter.get("/unauthorized", (req, res) => {
  res.render("unauthorized.handlebars", { title: "unauthorized" });
});

webRouter.get("/index", onlySessionActive, (req, res) => {
  res.render("index.handlebars", { title: "PRUEBA" });
});
webRouter.get("/realtimeproducts", onlySessionActive, onlyAdmin, (req, res) => {
  res.render("realTimeProducts.handlebars", { title: "REAL" });
});
webRouter.get("/chat", onlySessionActive, onlyUser, (req, res) => {
  res.render("chat.handlebars", { title: "CHAT" });
});
webRouter.get(
  "/products",
  onlySessionActive,
  onlyUser,
  async (req, res, next) => {
    const criterioDeBusqueda = {};
    const opcionesDePaginacion = {
      limit: req.query.limit || 5,
      page: req.query.page || 1,
      lean: true,
    };

    const result = await productsManager.paginate(
      criterioDeBusqueda,
      opcionesDePaginacion
    );
    res.render("products.handlebars", {
      title: "products",
      ...req.user,
      hayDocs: result.docs.length > 0,
      docs: result.docs,
      limit: result.limit,
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage,
      hasPrevPage: result.hasPrevPage,
      prevPage: result.prevPage,
      pagingCounter: result.pagingCounter,
    });
  }
);
webRouter.get(
  "/carts/:cid",
  onlySessionActive,
  onlyUser,
  async (req, res, next) => {
    const { cid } = req.params;
    const result = await cartService.getCartByIdService({ _id: cid });
    let productList = result;
    logger.info(productList.products);
    // result.products;
    res.render("cart.handlebars", {
      title: "cart",
      products: productList,
      productsInCart: productList.products.length > 0,
    });
  }
);
