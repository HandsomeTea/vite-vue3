import path from 'path';
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
		},
		rollupOptions: {
			input: {
				main: path.join(__dirname, '../index.html')
			},
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						const [, models] = id.toString().split('node_modules/');

						return models.split('/')[0].toString();
					}
				},
				// 将入口文件main.ts也打包放到js文件夹里
				entryFileNames: 'js/[name]-[hash:16].js',
				// 用于命名代码拆分时创建的共享块的输出命名
				// 　　chunkFileNames: 'js/[name].[hash].js',
				// css
				assetFileNames: () => {
					return '[ext]/[name].[hash].[ext]';
				},
				// 拆分js到模块文件夹，同一个模块的会合并到一起
				chunkFileNames: (chunkInfo) => {
					const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
					const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';

					return `js/${fileName}/[name].[hash].js`; // fileName与[name]取值相同，不确认fileName文件夹下是否固定为一个文件，所以js文件夹下又有一层文件夹
				}
			}
		}
	}
} as UserConfig;
