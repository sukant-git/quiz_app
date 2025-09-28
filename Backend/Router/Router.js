import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getQs, addQs, uploadPdf } from "../Controller/Controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const uploadDir = path.join(__dirname, "../upload");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/questions", getQs);
router.post("/questions", addQs);
router.post("/upload", upload.single("file"), uploadPdf);

export default router;
