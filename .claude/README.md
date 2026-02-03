# FLORCA Project - Claude Assistant Rules

This directory contains project-specific rules and guidelines for Claude working on the FLORCA flower import project.

## 📁 Directory Structure

```
.claude/
├── README.md                    # This file
├── rules/
│   └── CORE.md                  # Core rules (AUTO-LOADED, ~350 lines)
└── settings.local.json          # Local permissions

docs/rules/                      # Detailed documentation (NOT auto-loaded)
├── client/                      # Client-side rules (12 files)
│   ├── nextjs/                  # Next.js specific
│   └── react/                   # React SPA specific
├── server/                      # Server-side rules (10 files)
└── global/                      # Global rules (3 files)
```

## 🤖 How It Works

**Auto-loaded**: Only `.claude/rules/CORE.md` is automatically loaded into context (~350 lines, ~2% of context).

**On-demand**: Detailed documentation in `docs/rules/` can be accessed via the Read tool when needed. Reference paths are listed in CORE.md.

## 🎯 Key Principles (TL;DR)

- **Stack**:
  - Server: Node.js 20+, Fastify 4.x, TypeScript, MySQL 8.0+, Prisma 6.x, Redis 7.x
  - Client: React/Next.js, TypeScript, Tailwind CSS, React Query, Zod
- **Architecture**: Routes → Controllers → Services → Repositories → DB
- **API**: All routes prefixed with `/api/v1`
- **Response Format**:
  - Success: `{ success: true, message: "...", data: {...} }`
  - Error: `{ success: false, error: { code: "...", message: "..." } }`
- **Business**: Flower import (Holland/Ecuador → Georgia), credits system, dual-currency (EUR→GEL)
- **Safety**: Keep changes minimal, preserve existing behavior

## 📚 Accessing Detailed Documentation

When you need detailed rules, read from `docs/rules/`:

```
# Server documentation
docs/rules/server/01-architecture.md
docs/rules/server/02-database-and-migrations.md
docs/rules/server/06-stock-management.md
docs/rules/server/08-credits-system.md

# Client documentation
docs/rules/client/01-project-structure.md
docs/rules/client/02-component-patterns.md
docs/rules/client/08-color-system.md

# Global documentation
docs/rules/global/git-conventions.md
docs/rules/global/ai-edit-safety.md
```

Full reference table is in `.claude/rules/CORE.md`.
