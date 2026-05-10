import { Router, type IRouter } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth";

const router: IRouter = Router();

router.get("/admin/orders", requireAdmin, async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  res.json(
    orders.map((o) => ({
      ...o,
      total: parseFloat(o.total),
      discount: o.discount ? parseFloat(o.discount) : null,
    }))
  );
});

router.put("/admin/orders/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const { status } = req.body as { status?: string };
  if (!status) { res.status(400).json({ error: "status is required" }); return; }

  const [order] = await db
    .update(ordersTable)
    .set({ status })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  res.json({
    ...order,
    total: parseFloat(order.total),
    discount: order.discount ? parseFloat(order.discount) : null,
  });
});

export default router;
