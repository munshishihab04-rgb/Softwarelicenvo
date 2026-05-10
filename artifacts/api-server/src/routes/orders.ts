import { Router, type IRouter } from "express";
import { db, ordersTable, productsTable, licenseKeysTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { sendOrderDeliveryEmail } from "../lib/email";

const router: IRouter = Router();

router.post("/orders", async (req, res): Promise<void> => {
  const { items, customerEmail, customerName, paymentMethod, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Order must have at least one item" });
    return;
  }
  if (!customerEmail || !customerName || !paymentMethod) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const orderItems: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    licenseKey: string | null;
  }> = [];

  let total = 0;
  let hasMissingKey = false;

  for (const item of items) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, item.productId));

    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} not found` });
      return;
    }

    const unitPrice = parseFloat(product.price);
    const quantity = item.quantity ?? 1;

    // Try to assign an available key from inventory for each unit
    let assignedKey: string | null = null;
    const [availableKey] = await db
      .select()
      .from(licenseKeysTable)
      .where(and(
        eq(licenseKeysTable.productId, product.id),
        eq(licenseKeysTable.isUsed, false)
      ))
      .limit(1);

    if (availableKey) {
      assignedKey = availableKey.keyValue;
      // Mark as used (will update after order is created)
    } else {
      hasMissingKey = true;
    }

    orderItems.push({
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice,
      licenseKey: assignedKey,
    });

    total += unitPrice * quantity;
  }

  let discount: number | null = null;
  if (couponCode && couponCode.toUpperCase() === "SAVE10") {
    discount = total * 0.1;
    total = total - discount;
  }

  const orderStatus = hasMissingKey ? "pending_key" : "completed";

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerEmail,
      customerName,
      items: orderItems,
      total: total.toFixed(2),
      discount: discount ? discount.toFixed(2) : null,
      status: orderStatus,
      paymentMethod,
    })
    .returning();

  // Mark assigned inventory keys as used
  for (const orderItem of orderItems) {
    if (orderItem.licenseKey) {
      await db
        .update(licenseKeysTable)
        .set({ isUsed: true, orderId: order.id, assignedAt: new Date() })
        .where(and(
          eq(licenseKeysTable.productId, orderItem.productId),
          eq(licenseKeysTable.keyValue, orderItem.licenseKey)
        ));
    }
  }

  // Fire-and-forget delivery email (only if order is complete)
  if (orderStatus === "completed") {
    void sendOrderDeliveryEmail({
      orderId: order.id,
      customerName,
      customerEmail,
      items: orderItems,
      total,
      discount,
      paymentMethod,
    });
  }

  res.status(201).json({
    ...order,
    total: parseFloat(order.total),
    discount: order.discount ? parseFloat(order.discount) : null,
    items: orderItems,
  });
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json({
    ...order,
    total: parseFloat(order.total),
    discount: order.discount ? parseFloat(order.discount) : null,
  });
});

export default router;
