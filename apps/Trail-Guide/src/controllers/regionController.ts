import { Request, Response } from "express";
import * as regionModel from "../models/regionModel.js";

export async function renderAllRegions(req: Request, res: Response) {
  const regions = await regionModel.getAllRegions();

  res.render("regions/index", {
    title: "Regionen",
    regions,
    activePage: "regions",
  });
}

export async function renderRegionDetail(req: Request, res: Response) {
  const { slug } = req.params;

  if (typeof slug !== "string") {
    return res.status(400).send("Ungültiger Pfad");
  }

  const region = await regionModel.getRegionBySlug(slug);

  if (!region) {
    return res.status(404).send("Region nicht gefunden");
  }

  const trails = await regionModel.getTrailsByRegionId(region.id);

  res.render("regions/detail", {
    title: `Wandern im ${region.name}`,
    region,
    trails,
    activePage: "regions",
  });
}
