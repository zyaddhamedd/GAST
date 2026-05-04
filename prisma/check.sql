INSERT INTO "Order" ("customerName","phone","address","total","siteId")
VALUES ('test','01000000000','test address',100, (SELECT id FROM "Site" LIMIT 1));
SELECT "paymentMethod" FROM "Order" WHERE "customerName" = 'test';
DELETE FROM "Order" WHERE "customerName" = 'test';
