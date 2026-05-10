import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "changeme";
const JWT_SECRET = process.env.ADMIN_JWT_SECRET ?? "changeme-secret-32-chars-minimum!!";

export function generateAdminToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyAdminToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role: string };
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
