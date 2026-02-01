import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ["dist/", "node_modules/", ".astro/"],
  },
  {
    rules: {
      "astro/no-set-html-directive": "error"
    }
  }
];
