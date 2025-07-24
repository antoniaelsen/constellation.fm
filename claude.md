# Bash commands

# Code style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Keep import statements sorted by name; first '@' (organization) packages, then regular packages, then absolute project-specific import statements, and finally relative local import statements. Each section should be sorted alphabetically. E.g. `@threlte/core`, then `lodash`, then `$app/stores`, then `../sidebar.svelte`
- Destructure imports when possible (eg. import { foo } from 'bar')
- Avoid adding extraneous comments

## Frontend

- Prefer using flowbite-svelte components and tailwind styling over css where possible within custom svelte components

# Workflow

- Prefer running single tests, and not the whole test suite, for performance
