# Wallet System Design

**Date:** 2026-02-17
**Status:** Approved

## Overview

Account balance (wallet) system where users have a stored balance they can spend on products. Money is deposited by admins (payment gateway integration comes later). Full transaction ledger for audit trail.

## Architecture: Cached Balance + Ledger

- Separate `Wallet` model (1:1 with User) with a cached `balance` field
- `WalletTransaction` model as an append-only ledger
- All mutations inside Prisma `$transaction` blocks for atomicity
- Balance readable directly from wallet; verifiable by summing transactions

## Data Models

### Wallet

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| userId | UUID | Unique, FK -> User |
| balance | Decimal(12,2) | Cached balance, default 0.00 |
| currency | String | From env config |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### WalletTransaction

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| walletId | UUID | FK -> Wallet |
| type | Enum | DEPOSIT, WITHDRAWAL, PURCHASE, REFUND, ADJUSTMENT |
| amount | Decimal(12,2) | Always positive |
| balanceBefore | Decimal(12,2) | Snapshot before tx |
| balanceAfter | Decimal(12,2) | Snapshot after tx |
| description | String? | Optional note |
| referenceId | String? | For linking to orders/payments later |
| createdById | UUID? | FK -> User (admin who performed it) |
| createdAt | DateTime | |

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /wallet | authGuard (self) | Get own wallet balance |
| GET | /wallet/transactions | authGuard (self) | Own transactions (paginated) |
| GET | /users/:id/wallet | authGuard (ADMIN) | Any user's wallet |
| GET | /users/:id/wallet/transactions | authGuard (ADMIN) | Any user's transactions |
| POST | /users/:id/wallet/deposit | authGuard (ADMIN) | Credit a user's wallet |

## Business Rules

- Wallet auto-created on user registration
- All balance changes are atomic (Prisma $transaction)
- Balance cannot go below 0
- Deposit amounts must be positive
- Transaction history is paginated
- Currency configurable via `WALLET_CURRENCY` env var (default: USD)

## Module Structure

```
src/modules/wallet/
  wallet.routes.ts
  wallet.controller.ts
  wallet.service.ts
  wallet.repo.ts
  wallet.schemas.ts
```
