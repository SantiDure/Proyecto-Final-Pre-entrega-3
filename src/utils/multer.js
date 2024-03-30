import path from "path";
import { fileURLToPath } from "url"; // Importar fileURLToPath desde el módulo 'url'
import multer from "multer";

// Obtener el directorio actual del archivo
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.params.uid && req.params.typeofdocument) {
      const uid = req.params.uid;
      const typeOfDocument = req.params.typeofdocument;
      switch (typeOfDocument) {
        case "profiles":
          const profilePath = path.join(__dirname, "../uploads/profiles");
          cb(null, profilePath);
          break;
        case "products":
          const productPath = path.join(__dirname, "../uploads/products");
          cb(null, productPath);
          break;
        case "documents":
          const documentPath = path.join(__dirname, "../uploads/documents");
          cb(null, documentPath);
          break;
        default:
          cb(null, documentPath);
      }
    } else {
      throw new Error("faltan parametros");
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
