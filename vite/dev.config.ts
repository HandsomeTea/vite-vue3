import { UserConfig } from 'vite';

export default {
	mode: 'development',
	define: {
		__APP_VERSION__: JSON.stringify('v1'),
		'process.env': {
			NODE_ENV: 'development'
		}
	},
	logLevel: 'info',
	clearScreen: false,
	server: {
		host: '0.0.0.0',
		port: 3000,
		strictPort: false,
		open: true,
		proxy: {
			'/foo': 'http://localhost:4567/foo',
			'/api': {
				target: 'http://localhost:3003',
				changeOrigin: true
			},
			'^/fallback/.*': {
				target: 'http://jsonplaceholder.typicode.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/fallback/, '')
			},
			'/apis': {
				target: 'http://jsonplaceholder.typicode.com',
				changeOrigin: true,
				configure: (/*proxy, options*/) => {
					// proxy 是 'http-proxy' 的实例
				}
			}
		},
		cors: true
	}
} as UserConfig;
