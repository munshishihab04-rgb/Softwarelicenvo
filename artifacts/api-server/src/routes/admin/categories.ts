import { Router, type IRouter } from "express";
import { db, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth";

const router: IRouter = Router();

router.get("/admin/categories", requireAdmin, async (_req, res): Promise<void> => {
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.id);
  res.json(categories);
});

router.post("/admin/categories", requireAdmin, async (req, res): Promise<void> => {
  const { name, slug, icon, productCount } = req.body as Record<string, unknown>;

  if (!name || !slug || !icon) {
    res.status(400).json({ error: "Missing required fields: name, slug, icon" });
    return;
  }

  const [category] = await db
    .insert(categoriesTable)
    .values({
      name: String(name),
      slug: String(slug),
      icon: String(icon),
      productCount: Number(productCount ?? 0),
    })
    .returning();

  res.status(201).json(category);
});

router.put("/admin/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const body = req.body as Record<string, unknown>;
  const update: Record<string, unknown> = {};
  if (body.name !== undefined) update.name = String(body.name);
  if (body.slug !== undefined) update.slug = String(body.slug);
  if (body.icon !== undefined) update.icon = String(body.icon);
  if (body.productCount !== undefined) update.productCount = Number(body.productCount);

  const [category] = await db
    .update(categoriesTable)
    .set(update)
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!category) { res.status(404).json({ error: "Category not found" }); return; }
  res.json(category);
});

router.delete("/admin/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  res.json({ success: true });
});

export default router;
