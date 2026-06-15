import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Wir warten, bis die Antwort fertig ist
  res.on("finish", () => {
    const timestamp = new Date().toISOString();
    const { method, url } = req;
    const { statusCode } = res;

    const logLine = `[${timestamp}] ${method} ${url} - Status: ${statusCode}\n`;

    const logPath = path.join(process.cwd(), "logs", "access.log");

    fs.appendFile(logPath, logLine, (err) => {
      if (err) {
        console.error("Fehler beim Schreiben in die Log-Datei:", err);
      }
    });
  });

  next();
};
