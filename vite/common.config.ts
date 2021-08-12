import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import styleImport from 'vite-plugin-style-import';
import path from 'path';

export default {
    plugins: [
        vue(),
        styleImport({
            libs: [{
                libraryName: 'element-plus',
                esModule: true,
                ensureStyleFile: true,
                resolveStyle: (name) => `element-plus/lib/theme-chalk/${name}.css`,
                resolveComponent: (name) => `element-plus/lib/${name}`
            }, {
                libraryName: 'vant',
                esModule: true,
                resolveStyle: (name) => `vant/es/${name}/style`
            }]
        })
    ],
    publicDir: './public',
    resolve: {
        alias: [{
            find: '@', replacement: path.resolve(__dirname, '../src')
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
        }
    }
} as UserConfig;
