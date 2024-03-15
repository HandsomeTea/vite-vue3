<template>
	<el-main class="demo_style">
		{{ $t("SUCCESS") }}
		{{ user.username }}
		<p class="demo_style" @click="testApi">
			原data数据：{{ test }}
		</p>
		language {{ language }}
		<br>
		<van-button type="primary">
			主要按钮
		</van-button>
		<br>
		van-icon
		<van-icon name="chat-o" />
		<br>
		naive button
		<n-button type="info">
			Info
		</n-button>
		<router-view />
	</el-main>
</template>

<script lang="ts">
import Api from '@/api';
import { Tips } from '@/ui-frame';

import { defineComponent, ref } from 'vue';
import { getLoginUserInfo, getLang, redirectTo } from '@/views/lib';
import { useStore, Store } from 'vuex';
import { RootState } from '@/store/stateModel';

export default defineComponent({
	setup() {
		const user = getLoginUserInfo();
		const store: Store<RootState> = useStore();
		const setLanguage = async (language: SupportLanguageType): Promise<void> => {
			await store.dispatch('setLanguage', language);
		};
		const test = ref('string-data');

		return {
			user,
			language: getLang(),
			setLanguage,
			test,
			redirectTo
		};
	},
	methods: {
		async testApi() {
			await this.setLanguage('en');
			// console.log(this.$t('SUCCESS'));

			const { error } = await Api.Account.test({ 'test-body': '中文测试' });

			if (error) {
				// throw error.type || 'USER_SAVE_FAILED';
				// return Tips.alert('test message', 'test');
				return Tips.error(error?.type || 'USER_SAVE_FAILED');
			}
			Tips.success('SUCCESS');
			// console.log(456);
			// console.log(data);
		}
	}
});
</script>

<style lang="less" scoped>
.demo_style {
	color: @theme_color;
}

.video_test {
	width: 1000px;
}
</style>
