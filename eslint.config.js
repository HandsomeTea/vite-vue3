import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import globals from 'globals';

export default [
	{
		name: 'app/files-to-lint',
		files: ['**/*.{ts,mts,tsx,vue}']
	},
	{
		name: 'app/files-to-ignore',
		ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
	},
	...pluginVue.configs['flat/essential'],
	...vueTsEslintConfig(),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
				window: true,
				document: true,
				Element: true,
				HttpException: true,
				ApiResult: true,
				SupportLanguageType: true
			}
		},
		rules: {
			'vue/multi-word-component-names': 0,
			'vue/html-indent': ['error', 'tab'],
			'vue/max-attributes-per-line': [2, {
				'singleline': {
					max: 3
				}
			}],
			'@typescript-eslint/no-explicit-any': 2,
			'@typescript-eslint/no-inferrable-types': 2,
			indent: [2, 'tab'],
			'linebreak-style': [0, 'error', 'windows', 'unix'],
			quotes: [2, 'single'],
			'no-caller': 2,
			semi: ['error', 'always'],
			// '@typescript-eslint/semi': ['error', 'always'],
			'no-multiple-empty-lines': [2, { max: 2 }],
			'no-console': 2,
			'no-constant-condition': 2,
			'no-extra-parens': 2,
			'no-extra-semi': 2,
			'no-func-assign': 2,
			'no-mixed-spaces-and-tabs': [2, false],
			'no-trailing-spaces': 2,
			camelcase: 2,
			'comma-dangle': [2, 'never'],
			'consistent-this': [2, 'self'],
			'no-multi-spaces': 2,
			'no-multi-str': 2,
			'no-redeclare': 2,
			'no-undef': 2,
			'no-sparse-arrays': 2,
			'no-unreachable': 2,
			'no-unused-expressions': 2,
			'no-unused-vars': [2, { vars: 'all', args: 'after-used' }],
			'@typescript-eslint/no-unused-vars': 2,
			'no-use-before-define': 2,
			'no-extra-boolean-cast': 2,
			'no-void': 2,
			'no-var': 2,
			'brace-style': [2, '1tbs'],
			'arrow-spacing': 2,
			'comma-spacing': [2, { before: false, after: true }],
			'comma-style': [2, 'last'],
			curly: [2, 'all'],
			'default-case': 2,
			'dot-notation': [0, { allowKeywords: true }],
			eqeqeq: 2,
			'generator-star-spacing': 0,
			'init-declarations': 2,
			'key-spacing': [2, { beforeColon: false, afterColon: true }],
			'newline-after-var': 2,
			'id-match': 2,
			'semi-spacing': [0, { before: false, after: true }],
			'sort-vars': 0,
			'space-before-function-paren': [0, 'always'],
			strict: 2,
			'use-isnan': 2,
			'valid-typeof': 2,
			'no-useless-escape': 2,
			'require-atomic-updates': 'off'
		}
	}
];
