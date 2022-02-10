const ignoreNames = ['Window', '__dirname', '__filename', '[A-Z][a-z]+Actions','cfx_.+']
const ignoreFilter = {
  regex: `^(${ignoreNames.join('|')})$`,
  match: false,
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'import/first': 'off',
    'import/no-commonjs': 'off',
    // 通用规范开始
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
        filter: ignoreFilter,
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        filter: ignoreFilter,
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'objectLiteralProperty',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow',
        filter: ignoreFilter,
      },
      {
        selector: 'typeProperty',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow',
        filter: ignoreFilter,
      },
      {
        selector: 'enumMember',
        format: ['PascalCase', 'camelCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        filter: {
          regex: `^(${ignoreNames.join('|')})$`,
          match: false,
        },
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ], // 强制各类命名规范
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': [
      'warn',
      {
        fixToUnknown: false,
        ignoreRestArgs: true,
      },
    ], // 禁止使用除了...args之外的any 并修复为unknown
    '@typescript-eslint/semi': ['error', 'never'],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true,
        },
      },
    ], // 强制注释规范
    'no-console': 'off', // 禁止控制台输出
    '@typescript-eslint/explicit-member-accessibility': ['off'], // 强制规范类成员访问修饰符
    '@typescript-eslint/no-var-requires': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
