// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // Enforce single quotes
      '@/quotes': ['error', 'single', { avoidEscape: true }],
      // Disallow semicolons
      'semi': ['error', 'never'],
      // Vue-specific quote and semi rules
      'vue/html-quotes': ['error', 'double', { avoidEscape: true }],
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 2
        },
        multiline: {
          max: 2
        }
      }]
      // '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
      // '@typescript-eslint/semi': ['error', 'never']
    }
  }
)
