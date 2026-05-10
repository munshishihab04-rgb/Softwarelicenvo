import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  categoryId: integer("category_id").notNull(),
  categoryName: text("category_name").notNull(),
  type: text("type").notNull().default("key"),
  subscriptionDuration: text("subscription_duration"),
  platform: text("platform").notNull().default("Windows"),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  onSale: boolean("on_sale").notNull().default(false),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("4.5"),
  reviewCount: integer("review_count").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  badge: text("badge"),
  validity: text("validity"),
  deliveryType: text("delivery_type").default("key"),
  devices: integer("devices"),
  warningText: text("warning_text"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
