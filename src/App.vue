<template>
    <router-view />
</template>

<script lang="ts">
import { Store, useStore } from 'vuex';
import { defineComponent, onMounted, watch } from 'vue';
import { RootState } from '@/store/stateModel';
import { getLang } from '@/views/lib';
import i18n from '@/lang';

export default defineComponent({
    setup() {
        const store: Store<RootState> = useStore();

        const language = getLang();

        watch(language, () => {
            i18n.global.locale = language.value;
        });

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

        return {
            setWindowSize
        };
    },
    created(): void {
        // this.setWindowSize();
    }
});
</script>
