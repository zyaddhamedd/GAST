-- 1. Create the new PaymentMethod Enum type
DO $$ BEGIN
    CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'INSTAPAY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add values to OrderStatus enum
DO $$ BEGIN
    ALTER TYPE "OrderStatus" ADD VALUE 'PENDING_VERIFICATION';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE "OrderStatus" ADD VALUE 'REJECTED';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Add new columns to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProofImage" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

-- 4. Initialize and finalize updatedAt
UPDATE "Order" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
ALTER TABLE "Order" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
