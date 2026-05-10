import { Router, type IRouter } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth";

const router: IRouter = Router();

router.get("/admin/settings", requireAdmin, async (_req, res): Promise<void> => {
  const settings = await db.select().from(settingsTable);
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  res.json(result);
});

router.post("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const body = req.body as Record<string, string>;

  for (const [key, value] of Object.entries(body)) {
    const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
    if (existing.length > 0) {
      await db
        .update(settingsTable)
        .set({ value: String(value), updatedAt: new Date() })
        .where(eq(settingsTable.key, key));
    } else {
      await db.insert(settingsTable).values({ key, value: String(value) });
    }
  }

  const settings = await db.select().from(settingsTable);
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  res.json(result);
});

export default router;
