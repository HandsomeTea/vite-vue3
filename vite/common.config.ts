import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default {
    plugins: [
        vue()
        // styleImport({
        //     libs: [/*{
        //         libraryName: 'element-plus',
        //         esModule: true,
        //         ensureStyleFile: true,
        //         resolveStyle: (name) => `element-plus/lib/theme-chalk/${name}.css`,
        //         resolveComponent: (name) => `element-plus/lib/${name}`
        //     }, */{
        //             libraryName: 'vant',
        //             esModule: true,
        //             resolveStyle: (name) => `vant/es/${name}/style`
        //         }]
        // }),
        // AutoImport({
        //     resolvers: [ElementPlusResolver()]
        // })
        // Components({
        //     resolvers: [ElementPlusResolver()]
        // })
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
