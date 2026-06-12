<template>
	<div
		class="p-[4px] rounded-[6px] border-2 transition-all duration-300"
		:class="{ 'pulse-active': selected }"
		:style="{
			backgroundColor: theme.bg,
			borderColor: theme.primary,
			'--dynamic-color': theme.primary,
			'--dynamic-border-light': theme.borderLight,
			'--dynamic-rgb': theme.shadowRgb
		}"
	>
		<p
			class="items-center px-3 text-[12px] leading-[20px] font-semibold uppercase tracking-wider border-b border-gray-300"
			:style="{ color: theme.primary }"
		>
			<span v-if="nodeConfig?.svg" v-html="nodeConfig.svg" class="inline-flex mr-[2px]" />
			{{ nodeConfig?.name }}
		</p>
		<div :class="['mt-1 px-3 py-1 text-[12px]', selected ? 'text-gray-700' : 'text-gray-500']">
			{{ props.data.label }}
		</div>

		<Handle type="target" :position="Position.Left" :id="EDGE_HANDLE_ID.TARGET_LEFT" />
		<Handle type="source" :position="Position.Right" :id="EDGE_HANDLE_ID.SOURCE_RIGHT" />
	</div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { computed } from 'vue';
import { generateNodeTheme, EDGE_HANDLE_ID } from './lib';

const props = defineProps<{
	data: { type: string; label: string };
	selected: boolean;
	nodeConfigList: Record<
		string,
		{
			name: string;
			sourceNode: Array<string>;
			color: string;
			svg: string;
		}
	>;
}>();

const nodeConfig = computed(() => {
	const nodeType = props.data.type || 'origin';

	return props.nodeConfigList[nodeType];
});

const theme = computed(() => {
	const nodeType = props.data.type || 'origin';
	const mainColor = props.nodeConfigList[nodeType]?.color || '#165DFF';

	return generateNodeTheme(mainColor);
});

</script>

<style scoped lang="less">
:deep(.vue-flow__handle),
:deep(.vue-flow__handle:hover) {
	background-color: var(--dynamic-color);
}

@keyframes hardwareIntenseGlow {
	0% {
		opacity: 0.9;
	}

	50% {
		opacity: 0.3;
	}

	100% {
		opacity: 0.9;
	}
}

.pulse-active {
	&::before {
		content: '';
		position: absolute;
		inset: -3px;
		border: 2px solid var(--dynamic-color);
		border-radius: 8px;
		pointer-events: none;
		box-shadow:
			0 0 6px 4px rgba(var(--dynamic-rgb), 0.85),
			0 0 12px 1px rgba(var(--dynamic-rgb), 0.4);
		will-change: opacity;
		transform: translateZ(0);
		animation: hardwareIntenseGlow 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		z-index: -1;
	}
}
</style>
