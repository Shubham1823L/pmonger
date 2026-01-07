-- CreateTable
CREATE TABLE "SignupSession" (
    "otpUUID" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignupSession_pkey" PRIMARY KEY ("otpUUID")
);
