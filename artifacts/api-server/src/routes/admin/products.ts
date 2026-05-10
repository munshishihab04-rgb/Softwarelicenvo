import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth";

const router: IRouter = Router();

router.get("/admin/products", requireAdmin, async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).orderBy(productsTable.id);
  res.json(
    products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
      rating: parseFloat(p.rating),
    }))
  );
});

router.post("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const {
    name, slug, description, price, originalPrice, categoryId, categoryName,
    type, subscriptionDuration, platform, inStock, featured, onSale,
    rating, reviewCount, imageUrl, badge,
  } = body;

  if (!name || !slug || !description || !price || !categoryId || !categoryName || !imageUrl) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [product] = await db
    .insert(productsTable)
    .values({
      name: String(name),
      slug: String(slug),
      description: String(description),
      price: String(price),
      originalPrice: originalPrice ? String(originalPrice) : null,
      categoryId: Number(categoryId),
      categoryName: String(categoryName),
      type: String(type ?? "key"),
      subscriptionDuration: subscriptionDuration ? String(subscriptionDuration) : null,
      platform: String(platform ?? "Windows"),
      inStock: Boolean(inStock ?? true),
      featured: Boolean(featured ?? false),
      onSale: Boolean(onSale ?? false),
      rating: String(rating ?? "4.5"),
      reviewCount: Number(reviewCount ?? 0),
      imageUrl: String(imageUrl),
      badge: badge ? String(badge) : null,
    })
    .returning();

  res.status(201).json({
    ...product,
    price: parseFloat(product.price),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
    rating: parseFloat(product.rating),
  });
});

router.put("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const body = req.body as Record<string, unknown>;
  const update: Record<string, unknown> = {};

  if (body.name !== undefined) update.name = String(body.name);
  if (body.slug !== undefined) update.slug = String(body.slug);
  if (body.description !== undefined) update.description = String(body.description);
  if (body.price !== undefined) update.price = String(body.price);
  if (body.originalPrice !== undefined) update.originalPrice = body.originalPrice ? String(body.originalPrice) : null;
  if (body.categoryId !== undefined) update.categoryId = Number(body.categoryId);
  if (body.categoryName !== undefined) update.categoryName = String(body.categoryName);
  if (body.type !== undefined) update.type = String(body.type);
  if (body.subscriptionDuration !== undefined) update.subscriptionDuration = body.subscriptionDuration ? String(body.subscriptionDuration) : null;
  if (body.platform !== undefined) update.platform = String(body.platform);
  if (body.inStock !== undefined) update.inStock = Boolean(body.inStock);
  if (body.featured !== undefined) update.featured = Boolean(body.featured);
  if (body.onSale !== undefined) update.onSale = Boolean(body.onSale);
  if (body.rating !== undefined) update.rating = String(body.rating);
  if (body.reviewCount !== undefined) update.reviewCount = Number(body.reviewCount);
  if (body.imageUrl !== undefined) update.imageUrl = String(body.imageUrl);
  if (body.badge !== undefined) update.badge = body.badge ? String(body.badge) : null;

  const [product] = await db
    .update(productsTable)
    .set(update)
    .where(eq(productsTable.id, id))
    .returning();

  if (!product) { res.status(404).json({ error: "Product not found" }); return; }

  res.json({
    ...product,
    price: parseFloat(product.price),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
    rating: parseFloat(product.rating),
  });
});

router.delete("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.json({ success: true });
});

export default router;
