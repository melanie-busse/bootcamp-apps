import { Router } from "express";
import * as trailController from "../controllers/trailController.js";
import * as regionController from "../controllers/regionController.js";

const router = Router();

// Startseite
router.get("/", trailController.renderAllTrails);

// Detailseite (mit Variable :slug)
router.get("/trails/:slug", trailController.renderTrailDetail);

//Regionen
router.get("/regions", regionController.renderAllRegions);
router.get("/regions/:slug", regionController.renderRegionDetail);

export default router;
