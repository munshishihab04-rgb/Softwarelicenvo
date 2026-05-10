import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const licenseKeysTable = pgTable("license_keys", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  keyValue: text("key_value").notNull().unique(),
  isUsed: boolean("is_used").notNull().default(false),
  orderId: integer("order_id"),
  assignedAt: timestamp("assigned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type LicenseKey = typeof licenseKeysTable.$inferSelect;
