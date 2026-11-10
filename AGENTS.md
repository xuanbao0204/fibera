
# Fibera - AI Coding Instructions

## 1. Project Overview

Fibera is a room rental search and management platform.

Technology stack:
- Frontend: Next.js, React, TypeScript
- Backend: NestJS, TypeScript
- Database: To be integrated
- AI moderation: Python LLM service

## 2. General Rules

- Always inspect existing source code before making changes.
- Do not create duplicate classes, interfaces, types or services.
- Do not arbitrarily change the existing architecture.
- Prefer small, modular and maintainable implementations.
- Follow existing naming conventions.
- Use strict TypeScript typing.
- Avoid `any` unless absolutely necessary.
- Do not install dependencies without explaining why.
- Do not modify unrelated files.

## 3. Backend Architecture

Follow NestJS modular architecture.

Each business module should separate:
- Controllers
- Services
- Repositories
- DTOs
- Types
- Interfaces

Keep shared types and enums centralized in the existing
commons/types structure when appropriate.

Use Dependency Injection.

Keep business logic inside Services, not Controllers.

Repository abstractions should isolate data access
from business logic.

## 4. API Standards

- Use DTO validation.
- Follow existing global ValidationPipe configuration.
- Use the existing response interceptor.
- Use the existing exception filter.
- Follow the existing API versioning convention.
- Do not manually wrap responses if the interceptor handles it.
- Use consistent HTTP status codes.

## 5. Authentication and Security

- Access token: JWT.
- Refresh token: opaque token stored securely.
- Password hashing: bcrypt abstraction.
- Authorization: Role-based access control.
- Validate permissions on protected endpoints.
- Never expose passwordHash or refresh tokens in API responses.
- Never commit secrets or environment files.

## 6. Frontend Standards

- Use reusable React components.
- Prefer server components where appropriate.
- Use client components only when interaction requires them.
- Keep API communication separate from UI components.
- Handle loading, error and empty states.
- Follow existing design tokens and conventions.

## 7. AI Agent Workflow

Before implementing a task:

1. Inspect relevant modules and dependencies.
2. Explain the proposed implementation.
3. Identify files that will be created or modified.
4. Wait for approval for architectural changes.

After implementation:

1. Run TypeScript checks.
2. Run relevant tests.
3. Run lint if available.
4. Review the Git diff.
5. Report modified files and remaining issues.

Never claim that tests pass without actually running them.
