import { defineConfig, mergeConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

import common from './vite/common.config';
import developConfig from './vite/dev.config';
import productConfig from './vite/pro.config';

export default defineConfig(async ({ command }) => {
	const env = command === 'serve' ? developConfig : productConfig;
	const merged = mergeConfig(common, env);

	if (command === 'serve') {
		return merged;
	}
	return mergeConfig(merged, {
		plugins: [
			visualizer({
				filename: 'static-analysis.html',
				gzipSize: true,
				brotliSize: true
			})
		]
	});
});
