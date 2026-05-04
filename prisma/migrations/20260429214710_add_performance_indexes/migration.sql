-- Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- CreateIndex
CREATE INDEX "Product_power_idx" ON "Product"("power");

-- CreateIndex
CREATE INDEX "Product_voltage_idx" ON "Product"("voltage");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt" DESC);

-- CreateIndex (Trigram for search)
CREATE INDEX IF NOT EXISTS idx_product_name_trgm ON "Product" USING gin (name gin_trgm_ops);
