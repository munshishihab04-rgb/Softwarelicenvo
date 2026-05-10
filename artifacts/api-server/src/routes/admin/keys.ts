import { Router, type IRouter } from "express";
import { db, licenseKeysTable, productsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth";

const router: IRouter = Router();

// GET /admin/keys?productId=X — list keys (optionally filtered)
router.get("/admin/keys", requireAdmin, async (req, res): Promise<void> => {
  const rawProductId = req.query.productId;
  const productId = rawProductId && rawProductId !== "null" && rawProductId !== "undefined"
    ? parseInt(String(rawProductId), 10)
    : null;

  const keys = productId
    ? await db.select().from(licenseKeysTable).where(eq(licenseKeysTable.productId, productId))
    : await db.select().from(licenseKeysTable);

  res.json(keys);
});

// GET /admin/keys/summary — counts per product
router.get("/admin/keys/summary", requireAdmin, async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).orderBy(productsTable.id);
  const allKeys = await db.select().from(licenseKeysTable);

  const summary = products.map((p) => {
    const productKeys = allKeys.filter((k) => k.productId === p.id);
    return {
      productId: p.id,
      productName: p.name,
      available: productKeys.filter((k) => !k.isUsed).length,
      used: productKeys.filter((k) => k.isUsed).length,
      total: productKeys.length,
    };
  });

  res.json(summary);
});

// POST /admin/keys/bulk — bulk insert keys
router.post("/admin/keys/bulk", requireAdmin, async (req, res): Promise<void> => {
  const { productId, keys } = req.body as { productId?: number; keys?: string[] };

  if (!productId || !Array.isArray(keys) || keys.length === 0) {
    res.status(400).json({ error: "productId and keys[] are required" });
    return;
  }

  const deduped = [...new Set(keys.map((k: string) => k.trim()).filter(Boolean))];
  if (deduped.length === 0) {
    res.status(400).json({ error: "No valid keys provided" });
    return;
  }

  const inserted = await db
    .insert(licenseKeysTable)
    .values(deduped.map((k) => ({ productId: Number(productId), keyValue: k })))
    .onConflictDoNothing()
    .returning();

  res.status(201).json({ inserted: inserted.length, skipped: deduped.length - inserted.length });
});

// DELETE /admin/keys/:id
router.delete("/admin/keys/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  await db.delete(licenseKeysTable).where(eq(licenseKeysTable.id, id));
  res.json({ success: true });
});

export default router;
