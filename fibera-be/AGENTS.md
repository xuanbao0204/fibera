
# Fibera Backend Instructions

## Framework

- NestJS
- TypeScript
- ES Modules
- Use `.js` extensions in relative imports when required
  by the existing NodeNext/ESM configuration.

## Existing Architecture

Inspect and reuse:
- AccountsModule
- AuthModule
- UsersModule
- Commons
- PasswordHasher
- BcryptPasswordHasher
- ApiException
- HttpExceptionFilter
- ResponseInterceptor

## Coding Rules

- Controllers handle HTTP requests only.
- Services contain business logic.
- Repositories handle persistence.
- DTOs validate incoming requests.
- Types and enums should be grouped logically.
- Reuse existing abstractions before introducing new ones.
- Avoid direct database access inside Controllers.
- Do not bypass the PasswordHasher abstraction.

## Implementation Rules

Before adding a new module:
1. Inspect existing modules.
2. Identify domain dependencies.
3. Define entities and relationships.
4. Define DTOs and API contracts.
5. Implement Repository.
6. Implement Service.
7. Implement Controller.
8. Add tests.

Do not introduce ORM or database dependencies
until explicitly requested.
