import express from "express";
import nunjucks from "nunjucks";
import webRoutes from "./routes/webRoutes.js";
import { requestLogger } from "./middleware/logger.js";
import path from "path";

const app = express();
const port = 3000;

// 1. Nunjucks Konfiguration
nunjucks.configure(path.join(process.cwd(), "views"), {
  autoescape: true,
  express: app,
  noCache: true,
});

app.set("view engine", "html"); // Sagt Express: Dateien in /views sind HTML

// 2. Middleware
app.use(requestLogger);
app.use(express.static("public")); // Statische Dateien (CSS, Bilder)
app.use(express.urlencoded({ extended: true })); // Wichtig für Formulare

// 3. Routen
app.use("/", webRoutes);

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Seite nicht gefunden",
    activePage: null,
  });
});

// Der Server startet
app.listen(port, () => {
  console.log(`Server läuft unter http://localhost:${port}`);
});
