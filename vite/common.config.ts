import { UserConfig } from 'vite';
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver, NaiveUiResolver, VantResolver } from 'unplugin-vue-components/resolvers';

export default {
    plugins: [
        PkgConfig(),
        OptimizationPersist(),
        vue(),
        AutoImport({
            resolvers: [
                ElementPlusResolver(),
                NaiveUiResolver(),
                VantResolver()
            ]
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
                NaiveUiResolver(),
                VantResolver()
            ]
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
