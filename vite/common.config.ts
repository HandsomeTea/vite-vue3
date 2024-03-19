import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postcssPresetEnv from 'postcss-preset-env';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver, NaiveUiResolver, VantResolver } from 'unplugin-vue-components/resolvers';

export default {
	plugins: [
		vue(),
		AutoImport({
			resolvers: [
				ElementPlusResolver(),
				NaiveUiResolver(),
				VantResolver()
			],
			dts: path.join(__dirname, '../auto-imports.d.ts')
		}),
		Components({
			resolvers: [
				ElementPlusResolver(),
				NaiveUiResolver(),
				VantResolver()
			],
			dts: path.join(__dirname, '../components.d.ts')
		}),
		visualizer({ filename: 'static-analysis.html' })
	],
	// 默认也为public目录
	publicDir: './public',
	resolve: {
		alias: [{
			find: '@',
			replacement: path.resolve(__dirname, '../src')
		}]
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
