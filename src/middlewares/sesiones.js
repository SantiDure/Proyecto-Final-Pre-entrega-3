import session from "express-session";
import connectMongo from "connect-mongo";

const store = connectMongo.create({
  mongoUrl:
    "mongodb+srv://SantiDure:Sd232702@cluster0.gb6sgd5.mongodb.net/ecommerce",
});

export const sesiones = session({
  store,
  secret: "secretDePrueba",
  resave: true,
  saveUninitialized: true,
});
