/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended'
  ]
}
