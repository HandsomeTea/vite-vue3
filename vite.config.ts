import { defineConfig } from 'vite';

import common from './vite/common.config';
import developConfig from './vite/dev.config';
import productConfig from './vite/pro.config';


export default defineConfig(async ({ command }) => ({
    ...common,
    ...command === 'serve' ? developConfig : productConfig
}));
