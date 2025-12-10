# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run setup     # Install deps, generate Prisma client, run migrations
npm run dev       # Start dev server with Turbopack (http://localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
npm run test      # Run Vitest tests
npm run db:reset  # Reset database (destructive)
```

Single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in chat, and the AI generates React code that renders in real-time.

### Key Layers

**Virtual File System** (`src/lib/file-system.ts`)
- In-memory file system (`VirtualFileSystem` class) that stores generated components
- No files are written to disk - everything lives in memory
- Supports serialization/deserialization for persistence to database

**AI Integration** (`src/app/api/chat/route.ts`)
- Uses Vercel AI SDK with Anthropic Claude (claude-haiku-4-5)
- Two AI tools for file manipulation:
  - `str_replace_editor` (`src/lib/tools/str-replace.ts`): create, view, replace, insert
  - `file_manager` (`src/lib/tools/file-manager.ts`): rename, delete
- Falls back to `MockLanguageModel` when no API key is set

**Live Preview** (`src/lib/transform/jsx-transformer.ts`, `src/components/preview/PreviewFrame.tsx`)
- Transforms JSX/TSX using Babel standalone in browser
- Creates import maps with blob URLs for each virtual file
- Third-party packages loaded from esm.sh
- Preview runs in sandboxed iframe with Tailwind CSS via CDN

**React Contexts** (`src/lib/contexts/`)
- `FileSystemContext`: Manages virtual file system state, handles tool calls from AI
- `ChatContext`: Wraps Vercel AI SDK's `useChat`, syncs files to API

### Data Model (Prisma/SQLite)

- `User`: email/password auth with JWT sessions
- `Project`: stores serialized messages and file system data per user

### Path Alias

`@/*` maps to `./src/*` - use this for all imports.
