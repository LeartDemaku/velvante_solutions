# Contributing to VELVANTE

## Code Quality Standards

1. **TypeScript**:
   - Strict mode enabled (`noImplicitAny`, `noUncheckedIndexedAccess`).
   - Do not use `any` types unless strictly necessary.

2. **Formatting & Linting**:
   - Run `npx tsc --noEmit` before committing code.
   - Run `npm run build` to verify production compilation.

3. **Internationalization**:
   - All user-facing text must be defined in JSON translation files under `locales/en/` and `locales/sq/`.
