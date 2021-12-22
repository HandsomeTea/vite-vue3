<template>
    <router-view />
</template>

<script lang="ts">
import { Store, useStore } from 'vuex';
import { defineComponent, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { RootState } from '@/store/stateModel';
import { getLang } from '@/views/lib';
import i18n from '@/lang';

export default defineComponent({
    setup() {
        // 设置语言
        const language = getLang();

        watch(language, () => {
            i18n.global.locale = language.value;
        });

        // 适应窗口大小
        const store: Store<RootState> = useStore();
        const setWindowSize = () => store.dispatch('setScreenType');

        onMounted(() => {
            let waitForResizeEndTimer: null | number = null;

            window.onresize = () => {
                const waitTime = 500;

                if (waitForResizeEndTimer === null) {
                    waitForResizeEndTimer = window.setTimeout(() => {
                        setWindowSize();
                    }, waitTime);
                } else {
                    clearTimeout(waitForResizeEndTimer);
                    waitForResizeEndTimer = window.setTimeout(() => {
                        setWindowSize();
                    }, waitTime);
                }
            };
        });

        // 设置浏览器标签的title
        const route = useRoute();

        watch(() => route.path, () => {
            document.title = route.meta.i18nNavigateName as string || 'vite app';
        });

        return {
            setWindowSize
        };
    },
    created(): void {
        // this.setWindowSize();
    }
});
</script>
