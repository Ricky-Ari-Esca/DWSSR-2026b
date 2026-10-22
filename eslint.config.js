
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import { plugins, rules } from 'eslint-config-airbnb-extended';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

const extractRules = (categories) =>
  Object.values(categories).reduce(
    (result, category) => ({
      ...result,
      ...category.rules,
    }),
    {},
  );

const airbnbBaseRules = extractRules(rules.base);
const airbnbNodeRules = extractRules(rules.node);

export default defineConfig([
  // Archivos y carpetas que ESLint debe ignorar.
  globalIgnores(['dist/**', 'node_modules/**']),

  // Reglas recomendadas de JavaScript.
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
  },

  // Configuraciones de Airbnb Extended.
  plugins.stylistic,
  plugins.importX,

  // Configuración para el backend de Express y Node.js.
  {
    files: ['server/**/*.{js,mjs,cjs}', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },

    ...plugins.node,

    rules: {
      ...airbnbBaseRules,
      ...airbnbNodeRules,

      // Compatibilidad con patrones utilizados por Express y Node.js.
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'no-shadow': 'off',
      'no-console': 'off',
      'n/no-process-exit': 'off',
      'n/no-sync': 'off',

      // Importaciones de módulos ES y alias del proyecto.
      'import-x/order': 'off',
      'import-x/extensions': 'off',
      'import-x/no-duplicates': 'off',
      'import-x/no-rename-default': 'off',
    },
  },

  // Configuración para el frontend.
  {
    files: ['src/**/*.{js,mjs,cjs}', 'public/**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      ...airbnbBaseRules,

      // Compatibilidad con los imports del frontend.
      'import-x/order': 'off',
      'import-x/extensions': 'off',
      'import-x/no-duplicates': 'off',
      'import-x/no-rename-default': 'off',

      // Permitir incrementos y advertir sobre console.log.
      'no-plusplus': 'off',
      'no-console': 'warn',
    },
  },

  // Evita conflictos entre las reglas de ESLint y Prettier.
  prettier,
]);
