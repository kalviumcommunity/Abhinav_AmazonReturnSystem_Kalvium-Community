-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'AUTO_APPROVED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SELLER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'SELLER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnRequest" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "product" TEXT,
    "customer" TEXT,
    "status" "ReturnStatus" NOT NULL DEFAULT 'PENDING',
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReturnRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "returnRequestId" TEXT,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "ReturnRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
