// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    { ignores: ['dist/', 'db/', 'assets/', 'coverage/', '.yarn/'] },
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // discord.js event listeners are conventionally async. Allow passing async
            // functions where a void-returning listener is expected; every listener
            // handles its own errors.
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { arguments: false } }],
            // Interpolating coin amounts and other numbers into user-facing strings is
            // idiomatic here.
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
        },
    },
    {
        // node:test's describe/it return promises by design, and tests assert on
        // fixtures that are known to exist.
        files: ['test/**/*.ts'],
        rules: {
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    {
        // The flat config file itself is not part of the TypeScript project.
        files: ['**/*.mjs'],
        extends: [tseslint.configs.disableTypeChecked],
    },
    prettierConfig,
);
