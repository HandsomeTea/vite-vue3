<template>
	<g class="vue-flow__edge-custom" @mouseenter="isLineHovered = true" @mouseleave="isLineHovered = false">
		<defs>
			<marker
				:id="`arrow-${id}`"
				viewBox="0 0 10 10"
				refX="7"
				refY="5"
				markerWidth="6"
				markerHeight="6"
				orient="auto-start-reverse"
			>
				<path d="M 0 1 L 10 5 L 0 9 z" :fill="arrowColor" />
			</marker>
		</defs>

		<!-- 点击热区放大层 -->
		<path
			:id="`interaction-${id}`"
			:class="['vue-flow__edge-interaction', 'vue-flow__edge', { locked: !nodesDraggable }, { selected }]"
			:data-id="id"
			:d="edgePath"
			stroke="transparent"
			stroke-width="16"
			fill="none"
			pointer-events="stroke"
		/>

		<path
			:id="id"
			:class="[
				'vue-flow__edge-path',
				{ locked: !nodesDraggable },
				props.data?.status,
				{ selected, 'is-hovered': isLineHovered || isLabelHovered }
			]"
			:d="edgePath"
			:marker-end="`url(#arrow-${id})`"
		/>

		<EdgeLabelRenderer v-if="!!props.data?.label">
			<span
				:style="{
					position: 'absolute',
					transform: `translate(-50%, -50%) translate(${edgeCenterX}px, ${edgeCenterY}px)`,
					pointerEvents: 'all'
				}"
				@click.stop="handleLabelClick"
				@contextmenu.prevent.stop="handleLabelContextMenu"
				@mouseenter="isLabelHovered = true"
				@mouseleave="isLabelHovered = false"
				class="flex items-center justify-center px-[8px] py-[3px] text-[10px] font-medium rounded-full cursor-pointer label-capsule"
				:class="[
					{ locked: !nodesDraggable },
					props.data?.status,
					isLineHovered || isLabelHovered ? 'is-hovered' : '',
					selected ? 'is-selected' : ''
				]"
			>
				{{ props.data?.label }}
			</span>
		</EdgeLabelRenderer>
	</g>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core';
import type { EdgeProps, GraphEdge } from '@vue-flow/core';

const props = defineProps<EdgeProps>();

const isLineHovered = ref(false);
const isLabelHovered = ref(false);

const onEdgeLabelClick = inject<(params: { event: MouseEvent; edge: GraphEdge }) => void>('onEdgeLabelClick');
const onEdgeContextMenu = inject<(params: { event: MouseEvent; edge: GraphEdge }) => void>('onEdgeContextMenu');

const { addSelectedEdges, removeSelectedEdges, getSelectedEdges, nodesDraggable } = useVueFlow();

const adjustedCoordinates = computed(() => {
	const sourceOffset = 0;
	const targetOffset = 3; // 预留给箭头的空间偏移

	let srcX = props.sourceX;
	let tgtX = props.targetX;
	let srcY = props.sourceY;
	let tgtY = props.targetY;

	if (props.sourcePosition === 'right') srcX += sourceOffset;
	else if (props.sourcePosition === 'left') srcX -= sourceOffset;
	else if (props.sourcePosition === 'bottom') srcY += sourceOffset;
	else if (props.sourcePosition === 'top') srcY -= sourceOffset;

	if (props.targetPosition === 'left') tgtX -= targetOffset;
	else if (props.targetPosition === 'right') tgtX += targetOffset;
	else if (props.targetPosition === 'top') tgtY -= targetOffset;
	else if (props.targetPosition === 'bottom') tgtY += targetOffset;

	return { srcX, srcY, tgtX, tgtY };
});

const bezierResult = computed(() => {
	return getBezierPath({
		sourceX: adjustedCoordinates.value.srcX,
		sourceY: adjustedCoordinates.value.srcY,
		sourcePosition: props.sourcePosition,
		targetX: adjustedCoordinates.value.tgtX,
		targetY: adjustedCoordinates.value.tgtY,
		targetPosition: props.targetPosition
	});
});
const edgePath = computed(() => bezierResult.value[0]);

const originalBezierResult = computed(() => {
	return getBezierPath({
		sourceX: props.sourceX,
		sourceY: props.sourceY,
		sourcePosition: props.sourcePosition,
		targetX: props.targetX,
		targetY: props.targetY,
		targetPosition: props.targetPosition
	});
});
const edgeCenterX = computed(() => originalBezierResult.value[1]);
const edgeCenterY = computed(() => originalBezierResult.value[2]);

const arrowColor = computed(() => {
	if (props.data?.status === 'success') {
		if (nodesDraggable.value && (props.selected || isLineHovered.value || isLabelHovered.value)) {
			return '#10b981';
		}
		return '#3BD45C';
	} else if (props.data?.status === 'failed') {
		if (nodesDraggable.value && (props.selected || isLineHovered.value || isLabelHovered.value)) {
			return '#ef4444';
		}
		return '#F27979';
	} else if (props.data?.status === 'running') {
		if (nodesDraggable.value && (props.selected || isLineHovered.value || isLabelHovered.value)) {
			return '#f97316';
		}
		return '#FFAB5C';
	} else {
		if (nodesDraggable.value && props.selected) {
			return '#165dff';
		}
		if (nodesDraggable.value && (isLineHovered.value || isLabelHovered.value)) {
			return '#3b82f6';
		}
		return '#cbd5e1';
	}
});

const handleLabelClick = (e: MouseEvent) => {
	const isMultiSelectKeyPressed = e.shiftKey || e.ctrlKey || e.metaKey;

	if (!isMultiSelectKeyPressed) {
		removeSelectedEdges(getSelectedEdges.value.filter(edge => edge.id !== props.id));
	}

	const currentEdge = {
		id: props.id,
		source: props.source,
		target: props.target,
		type: props.type,
		data: props.data,
		label: props.label,
		selected: true
	};

	addSelectedEdges([currentEdge]);
	if (onEdgeLabelClick) onEdgeLabelClick({ event: e, edge: currentEdge });
};

const handleLabelContextMenu = (e: MouseEvent) => {
	const currentEdge = {
		id: props.id,
		source: props.source,
		target: props.target,
		type: props.type,
		data: props.data,
		label: props.label,
		selected: props.selected
	};

	if (onEdgeContextMenu) {
		onEdgeContextMenu({ event: e, edge: currentEdge });
		return;
	}

	// 🎯 核心联动：模拟出来的右键事件必须携带完整冒泡上下文，让主画布的 composedPath 能精准打捞到 data-id
	const linePathElement = document.getElementById(`interaction-${props.id}`);

	if (linePathElement) {
		const simulatedEvent = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: e.clientX,
			clientY: e.clientY,
			screenX: e.screenX,
			screenY: e.screenY,
			button: 2,
			buttons: 2
		});

		linePathElement.dispatchEvent(simulatedEvent);
	}
};

</script>

<style scoped lang="less">
.vue-flow__edge-interaction {
	cursor: pointer;
	transition: none !important;
}

.vue-flow__edge-path {
	stroke: #cbd5e1;
	stroke-width: 2;
	transition: stroke 0.2s ease;

	&.locked {
		stroke: #cbd5e1;
	}

	&:not(.locked) {
		&.is-hovered {
			stroke: #3b82f6;
		}

		&.selected {
			stroke: #165dff;

			.vue-flow__edge-custom:hover & {
				stroke: #165dff;
			}
		}
	}

	&.success {
		stroke: #3bd45c;

		&:not(.locked) {
			&.is-hovered,
			&.selected {
				stroke: #10b981;
			}

			.vue-flow__edge-custom:hover &.selected {
				stroke: #10b981;
			}
		}
	}

	&.failed {
		stroke: #f27979;

		&:not(.locked) {
			&.is-hovered,
			&.selected {
				stroke: #ef4444;
			}

			.vue-flow__edge-custom:hover &.selected {
				stroke: #ef4444;
			}
		}
	}

	&.running {
		stroke: #ffab5c;

		&:not(.locked) {
			&.is-hovered,
			&.selected {
				stroke: #f97316;
			}

			.vue-flow__edge-custom:hover &.selected {
				stroke: #f97316;
			}
		}
	}
}

.label-capsule {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	line-height: 1;

	padding-top: 2.5px;
	padding-bottom: 1.5px;

	backdrop-filter: blur(4px);
	border: 1px solid rgba(226, 232, 240, 0.8);
	background-color: rgba(248, 250, 252, 0.9);
	color: #64748b;
	font-weight: 500;
	transition:
		color 0.15s ease,
		border-color 0.15s ease,
		background-color 0.15s ease,
		box-shadow 0.15s ease;

	&:not(.locked) {
		&.is-hovered {
			color: #ffffff;
			border-color: #3b82f6;
			background-color: #3b82f6;
			box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
		}

		&.is-selected {
			color: #ffffff;
			border-color: #2563eb;
			background-color: #2563eb;
			box-shadow: 0 0 16px rgba(37, 99, 235, 0.6);
			font-weight: 600;
		}
	}

	&.success {
		color: #10b981;
		border: 1px solid #d1fae5;
		background-color: #f0fdf4;

		&:not(.locked) {
			&.is-hovered:not(.is-selected) {
				color: #ffffff;
				border-color: #10b981;
				background-color: #10b981;
				box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
			}

			&.is-selected {
				color: #ffffff;
				border-color: #059669;
				background-color: #10b981;
				box-shadow: 0 0 18px rgba(16, 185, 129, 0.65);
				font-weight: 600;
			}
		}
	}

	&.failed {
		color: #ef4444;
		border: 1px solid #fee2e2;
		background-color: #fef2f2;

		&:not(.locked) {
			&.is-hovered:not(.is-selected) {
				color: #ffffff;
				border-color: #ef4444;
				background-color: #ef4444;
				box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
			}

			&.is-selected {
				color: #ffffff;
				border-color: #dc2626;
				background-color: #ef4444;
				box-shadow: 0 0 18px rgba(239, 68, 68, 0.65);
				font-weight: 600;
			}
		}
	}

	&.running {
		color: #f97316;
		border: 1px solid #ffedd5;
		background-color: #fff7ed;

		&:not(.locked) {
			&.is-hovered:not(.is-selected) {
				color: #ffffff;
				border-color: #f97316;
				background-color: #f97316;
				box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
			}

			&.is-selected {
				color: #ffffff;
				border-color: #ea580c;
				background-color: #f97316;
				box-shadow: 0 0 18px rgba(249, 115, 22, 0.65);
				font-weight: 600;
			}
		}
	}
}
</style>
