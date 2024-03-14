import { UserConfig } from 'vite';

export default {
	mode: 'production',
	define: {
		__APP_VERSION__: JSON.stringify('v1'),
		'process.env.NODE_ENV': JSON.stringify('production')
	},
	build: {
		target: 'modules',
		outDir: './dist',
		assetsDir: 'public',
		cssCodeSplit: true,
		sourcemap: false,
		minify: 'terser',
		chunkSizeWarningLimit: 500,
		terserOptions: {
			// 生产环境下移除console
			compress: {
				// eslint-disable-next-line camelcase
				drop_console: true,
				// eslint-disable-next-line camelcase
				drop_debugger: true
			}
		}
	}
} as UserConfig;
