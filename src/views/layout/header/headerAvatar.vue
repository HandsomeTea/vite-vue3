<template>
	<a-dropdown>
		<a-button>
			<icon-user class="text-[#3370ff] text-[18px]" />&nbsp;&nbsp;liuhaifeng
			&nbsp;&nbsp;<icon-down />
		</a-button>

		<template #icon>
			<icon-down />
		</template>
		<template #content>
			<a-doption>设置</a-doption>
			<a-doption class="text-red-500">
				退出登录
			</a-doption>
		</template>
	</a-dropdown>
</template>
