<template>
	<div class="demo_style">
		{{ $t('SUCCESS') }}
		{{ user.username }}
		<p class="demo_style" @click="testApi">原data数据：{{ test }}</p>
		language {{ language }}
		<br />
		<router-view />
	</div>
</template>

<script setup lang="ts">
import Api from '@/api';
import { Tips } from '@/ui-frame';

import { ref } from 'vue';
import { getLoginUserInfo, getLang, setLanguage } from '@/views/lib';

const user = getLoginUserInfo();

const test = ref('string-data');

const testApi = async () => {
	setLanguage('en');
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
};
const language = getLang();

</script>

<style lang="less" scoped>
.demo_style {
	color: @theme_color;
}

.video_test {
	width: 1000px;
}
</style>
