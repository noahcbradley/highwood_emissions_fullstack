-- CreateTable
CREATE TABLE "methane_readings" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "methane_readings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "methane_readings_siteId_timestamp_key" ON "methane_readings"("siteId", "timestamp");

-- AddForeignKey
ALTER TABLE "methane_readings" ADD CONSTRAINT "methane_readings_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
