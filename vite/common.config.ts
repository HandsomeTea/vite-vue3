import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import styleImport, { VantResolve } from 'vite-plugin-style-import';

export default {
    plugins: [
        vue(),
        styleImport({
            resolves: [VantResolve()]
        }),
        AutoImport({
            resolvers: [ElementPlusResolver(), NaiveUiResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver(), NaiveUiResolver()]
        })
    ],
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
        }
    }
} as UserConfig;
