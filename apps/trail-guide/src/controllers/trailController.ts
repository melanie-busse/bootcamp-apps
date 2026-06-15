import { Request, Response } from "express";
import * as trailModel from "../models/trailModel.js";

// Zeigt alle Wanderwege auf der Startseite an
export async function renderAllTrails(req: Request, res: Response) {
  try {
    const trails = await trailModel.getAllTrails();
    res.render("index", {
      title: "Alle Wanderwege",
      trails: trails,
      activePage: "trails",
    });
  } catch (error) {
    console.error("FEHLER IM CONTROLLER:", error); // Das sollte im Terminal erscheinen
    res.status(500).send("Etwas ist schiefgelaufen");
  }
}
// Zeigt die Detailseite eines einzelnen Wanderweges
export async function renderTrailDetail(req: Request, res: Response) {
  try {
    const { slug } = req.params; // Holt den Namen aus der URL /trails/:slug

    if (typeof slug !== "string") {
      return res.status(400).send("Ungültiger Pfad");
    }
    const trail = await trailModel.getTrailBySlug(slug);

    if (!trail) {
      return res.status(404).render("404", {
        title: "Weg nicht gefunden",
      });
    }

    res.render("trail", {
      title: trail.name,
      trail: trail,
    });
  } catch (error) {
    console.error("Fehler beim Laden des Details:", error);
    res.status(500).send("Interner Serverfehler");
  }
}
