import { Router, type IRouter } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, type SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const { categoryId, search, featured, onSale, type } = req.query;

  const conditions: SQL[] = [];

  if (categoryId && categoryId !== "null" && categoryId !== "undefined") {
    const catIdNum = parseInt(categoryId as string, 10);
    if (!isNaN(catIdNum)) {
      conditions.push(eq(productsTable.categoryId, catIdNum));
    }
  }
  if (search && search !== "null" && search !== "undefined" && (search as string).trim() !== "") {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }
  if (featured === "true") {
    conditions.push(eq(productsTable.featured, true));
  }
  if (onSale === "true") {
    conditions.push(eq(productsTable.onSale, true));
  }
  if (type && type !== "null" && type !== "undefined" && (type === "key" || type === "subscription")) {
    conditions.push(eq(productsTable.type, type as string));
  }

  const products =
    conditions.length > 0
      ? await db.select().from(productsTable).where(and(...conditions))
      : await db.select().from(productsTable);

  res.json(
    products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
      rating: parseFloat(p.rating),
    }))
  );
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.featured, true));

  res.json(
    products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
      rating: parseFloat(p.rating),
    }))
  );
});

router.get("/products/deals", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.onSale, true));

  res.json(
    products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
      rating: parseFloat(p.rating),
    }))
  );
});

router.get("/products/stats", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable);
  const categories = await db.select().from(categoriesTable);

  res.json({
    totalProducts: products.length,
    totalCategories: categories.length,
    totalKeysSold: 48293,
    satisfiedCustomers: 32187,
  });
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({
    ...product,
    price: parseFloat(product.price),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
    rating: parseFloat(product.rating),
  });
});

router.get("/products/:id/related", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const related = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.categoryId, product.categoryId));

  const filtered = related.filter((p) => p.id !== id).slice(0, 4);

  res.json(
    filtered.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
      rating: parseFloat(p.rating),
    }))
  );
});

export default router;
