# TypeScript Type Checking

This project uses TypeScript Project References. Always use the following command for type checking:

```bash
npx tsc -b --noEmit
```

Do NOT use `npx tsc --noEmit` as it will not check all project references and may miss type errors.
