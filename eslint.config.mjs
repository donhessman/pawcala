import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import reactHooksExtra from 'eslint-plugin-react-hooks-extra';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    plugins: {
      prettier: prettierPlugin,
      'react-hooks-extra': reactHooksExtra,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          arrowParens: 'always',
          endOfLine: 'lf',
        },
      ],
      'react-hooks-extra/no-redundant-custom-hook': 'warn',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'warn',
      'react-hooks-extra/prefer-use-state-lazy-initialization': 'warn',
    },
  },
  prettierConfig,
]);

export default eslintConfig;
