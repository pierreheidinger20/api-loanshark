-- PostgreSQL schema for the loans collection replacement.
CREATE TYPE "loans_status_enum" AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE "loans_paymentFrequency_enum" AS ENUM ('monthly', 'yearly');

CREATE TABLE "loans" (
  "id" varchar(24) PRIMARY KEY,
  "amount" double precision NOT NULL,
  "interestRate" double precision NOT NULL,
  "startDate" timestamptz NOT NULL,
  "endDate" timestamptz,
  "borrowerName" varchar NOT NULL,
  "lenderName" varchar NOT NULL,
  "status" "loans_status_enum" NOT NULL DEFAULT 'active',
  "addresses" text[] NOT NULL DEFAULT '{}',
  "paymentFrequency" "loans_paymentFrequency_enum" NOT NULL DEFAULT 'monthly',
  "orders" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "user" jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false
);

CREATE INDEX "IDX_loans_user_username" ON "loans" (("user" ->> 'username'));
CREATE INDEX "IDX_loans_status_deleted" ON "loans" ("status", "deleted");
CREATE INDEX "IDX_loans_orders_gin" ON "loans" USING gin ("orders");
