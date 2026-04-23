import { fileURLToPath, URL } from 'node:url';
import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import vueJsx from '@vitejs/plugin-vue-jsx'
import postcssPresetEnv from 'postcss-preset-env';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';


export default {
	plugins: [
		vue(),
		vueJsx(),
		vueDevTools(),
		AutoImport({
			resolvers: [
				ArcoResolver()
			],
			// 如果需要自动导入 Arco 的 Message, Notification 等工具 API
			// imports: ['vue', 'vue-router'],
			dts: path.join(__dirname, '../auto-imports.d.ts')
		}),
		Components({
			resolvers: [
				ArcoResolver({
					sideEffect: true
				}),
				(componentName) => {
					if (componentName.startsWith('Icon')) {
						return {
							name: componentName,
							from: '@arco-design/web-vue/es/icon',
						};
					}
				}
			],
			dts: path.join(__dirname, '../components.d.ts')
		}),
		visualizer({
			// open: true,
			filename: 'static-analysis.html',
			gzipSize: true,
			brotliSize: true
		})
	],
	// 默认也为public目录
	publicDir: './public',
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('../src', import.meta.url))
		}
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				modifyVars: {
					hack: `true; @import (reference) "${path.resolve(__dirname, '../src/assets/style/global-var.less')}";`
				}
			}
		},
		postcss: {
			plugins: [postcssPresetEnv()]
		}
	}
} as UserConfig;
