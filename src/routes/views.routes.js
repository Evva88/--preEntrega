import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/cartManager.js";
import cartController from "../controllers/cart.controller.js";
import { sendPasswordRecoveryEmail } from "../controllers/messages.controller.js";
import UserController from '../controllers/user.controller.js';
import UserService from "../services/user.service.js";

const checkSession = async (req, res, next) => {
  req.logger.info("Checking session:", req.session);

  try {
    if (!req.userService) {
      req.userService = new UserService();
    }

    if (req.session && req.session.user) {
      req.logger.info("Session exists:", req.session.user);
      
      next();
    } else {
      req.logger.warn("No session found, redirecting to /login");
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



const checkAlreadyLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    req.logger.info("Usuario ya autenticado, redirigiendo a /profile");
    res.redirect("/profile");
  } else {
    req.logger.error("Usuario no autenticado, procediendo...");
    next();
  }
};

const viewsRouter = express.Router();
const PM = new ProductManager();
const CM = new CartManager();
const userService = new UserService(); 
const userController = new UserController(userService);

async function loadUserCart(req, res, next) {
  if (req.session && req.session.user) {
    const cartId = req.session.user.cart;
    req.logger.info("Cart ID:", cartId);

    const cartManager = new CartManager();
    const cart = await cartManager.getCart(cartId);
    req.logger.info("Cart:", cart);

    req.cart = cart;
  }
  next();
}

viewsRouter.get("/", checkSession, async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("home", { products });
});

viewsRouter.get("/products", checkSession, async (req, res) => {
  const products = await PM.getProducts(req.query);
  const user = req.session.user;

  req.logger.info(user);
  res.render("products", { products, user });
});

viewsRouter.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PM.getProductById(pid);
  if (product) {
    res.render("productDetail", { product });
  } else {
    res.status(404).send({ status: "error", message: "Product not found." });
  }
});

viewsRouter.get('/cart', (req, res) => {
  res.render('cart');
});

viewsRouter.get("/carts", loadUserCart, async (req, res) => {
  const cart = req.cart;
  if (cart) {
    req.logger.info(JSON.stringify(cart, null, 4));
    res.render("cart", { products: cart.products });
  } else {
    res.status(400).send({
      status: "error",
      message: "Error! No se encuentra el ID de Carrito!",
    });
  }
});

viewsRouter.post("/carts/:cid/purchase", async (req, res) => {
  const cid = req.params.cid;
  cartController.getPurchase(req, res, cid);
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

viewsRouter.get("/chat", (req, res) => {
  res.render("chat");
});

viewsRouter.get("/login", checkAlreadyLoggedIn, (req, res) => {
  res.render("login");
});

viewsRouter.get("/register", checkAlreadyLoggedIn, (req, res) => {
  res.render("register");
});

viewsRouter.get("/profile", checkSession, (req, res) => {
  console.log("Inside /profile route");

  const userData = req.session.user;
  req.logger.info("User data:", userData);

  res.render("profile", { user: userData });
});

viewsRouter.get("/restore", async (req, res) => {
  res.render("restore");
});

viewsRouter.post("/api/email/sendRestoreLink", sendPasswordRecoveryEmail);

// Ruta para cambiar la contraseña
viewsRouter.get("/reset-password", (req, res) => {
  const token = req.query.token;
  res.render("reset-password");
});

viewsRouter.get("/faillogin", (req, res) => {
  res.status(401).json({
    status: "error",
    message: "Login failed. Invalid username or password.",
  });
});

viewsRouter.get("/failregister", async (req, res) => {
  res.send({
    status: "Error",
    message: "Error! No se pudo registar el Usuario!",
  });
});

viewsRouter.get("/profile/becomePremium", checkSession, userController.showBecomePremiumView);

viewsRouter.post("/profile/becomePremium", checkSession, userController.becomePremium);

export default viewsRouter;
