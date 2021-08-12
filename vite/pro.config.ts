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
        chunkSizeWarningLimit: 500
    }
} as UserConfig;
