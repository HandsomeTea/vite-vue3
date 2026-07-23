<template>
	<div class="flow-wrapper" @dblclick.prevent="toAddNode('view')" @contextmenu.prevent="handleGlobalContextMenu">
		<vue-flow
			class="flow-canvas"
			@pane-click="
				() => {
					handleClearAllSelected();
					closeContextMenu();
				}
			"
			@node-click="onNodeClick"
			@edge-click="closeContextMenu()"
			@connect="handleConnect"
			@connect-start="
				e => {
					connectingStartNode.id = e.nodeId || '';
					connectingStartNode.position = e.handleType || '';
				}
			"
			@connect-end="
				connectingStartNode.id = '';
				connectingStartNode.position = '';
			"
			:fit-view="true"
			:select-nodes-on-drag="false"
			:snap-to-grid="true"
			:snap-grid="[20, 20]"
			:default-viewport="{ zoom: 1 }"
			:min-zoom="0.6"
			:max-zoom="1.4"
			:zoom-on-scroll="false"
			:pan-on-drag="false"
			:zoom-on-pinch="false"
			:connection-mode="ConnectionMode.Loose"
			:nodes-connectable="!props.showMode"
			:delete-key-code="!props.showMode ? 'Backspace' : null"
			:multi-selection-key-code="!props.showMode ? 'Control' : null"
		>
			<template #node-default="nodeProps">
				<base-node
					v-bind="nodeProps"
					:node-config-list="props.nodeConfigList"
					:connecting-start-node="connectingStartNode"
				/>
			</template>

			<template #edge-default="edgeProps">
				<base-edge v-bind="edgeProps" />
			</template>

			<background :gap="20" :size="0.5" variant="lines" pattern-color="rgba(0, 0, 0, 0.03)" />

			<Controls :show-zoom="false" :show-fit-view="false" :show-interactive="!props.showMode" position="top-left">
				<ControlButton title="整理布局" @click="handleLayout">
					<icon-dice class="max-w-[14px] max-h-[14px]" />
				</ControlButton>

				<template v-if="!props.showMode">
					<ControlButton v-if="nodesDraggable" title="添加节点" @click="toAddNode('view')">
						<icon-plus class="max-w-[14px] max-h-[14px]" />
					</ControlButton>

					<ControlButton
						v-if="nodesDraggable && getSelectedNodes.length + getSelectedEdges.length === 1"
						title="编辑选中"
						@click="toEdit('view')"
					>
						<icon-edit class="max-w-[14px] max-h-[14px]" />
					</ControlButton>

					<ControlButton
						v-if="nodesDraggable && (getSelectedNodes.length > 0 || getSelectedEdges.length > 0)"
						title="删除选中"
						@click="deleteSelectedEles('view')"
					>
						<icon-delete class="max-w-[14px] max-h-[14px] text-red-500" />
					</ControlButton>

					<a-tooltip position="bottom">
						<template #content>
							<p>右键操作：</p>
							<ul class="pl-[24px]">
								<li>1. 右键点击空白处：添加节点。</li>
								<li>2. 右键点击节点/连线：编辑/删除节点或连线。</li>
							</ul>
							<p class="mt-[10px]">点击操作：</p>
							<ul class="pl-[24px]">
								<li>1. 单击节点/连线：选中元素。</li>
								<li>2. 按住 Ctrl + 单击节点/连线：多选元素。</li>
							</ul>
							<p class="mt-[10px]">按键操作：</p>
							<ul class="pl-[24px]">
								<li>1. 删除节点/连线：选中要删除的节点/连线，按退格键可删除选中元素。</li>
							</ul>
							<p class="mt-[10px]">连线操作：</p>
							<ul class="pl-[24px]">
								<li>
									1. 节点的左右边框中段在鼠标靠近时会显示连接点，拖拽连接点至其他连接点可以创建连线。
								</li>
								<li>2. 连线后，连线的连接点会自动调整。</li>
								<li>
									3.
									一般认为，节点右侧的连接点为源连接点，左侧的连接点为目标连接点，即从A到B的连线，应该是从A节点的右侧连接点连接到B节点的左侧连接点。
								</li>
							</ul>
						</template>

						<ControlButton>
							<icon-question-circle class="max-w-[14px] max-h-[14px]" />
						</ControlButton>
					</a-tooltip>
				</template>
			</Controls>
		</vue-flow>

		<div
			v-if="contextMenu.show && nodesDraggable"
			class="custom-context-menu"
			:style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
			@click.stop
		>
			<div v-if="contextMenu.target.type === 'pane'" class="menu-item" @click="toAddNode('contextmenu')">
				<icon-plus class="mr-[6px]" /> 添加节点
			</div>
			<template v-else>
				<div class="menu-item" @click="toEdit('contextmenu')"><icon-edit class="mr-[6px]" /> 编辑</div>
				<div class="menu-item delete" @click="deleteSelectedEles('contextmenu')">
					<icon-delete class="mr-[6px]" /> 删除
				</div>
			</template>
		</div>

		<span v-if="canBack" class="history-operate-btn left-[12px]" @click="goBack()" @dblclick.stop> 上一步 </span>
		<span v-if="canNext" class="history-operate-btn right-[12px]" @click="goNext()" @dblclick.stop> 下一步 </span>
	</div>
</template>

<script
	setup
	lang="ts"
	generic="
		ChartNodeType extends string,
		ChartNodeData extends object & { label: string; type: ChartNodeType },
		ChartEdgeData extends object & { status?: 'running' | 'failed' | 'success'; label?: string }
	"
>
import { nextTick, onMounted, onUnmounted, provide, reactive, ref } from 'vue';
import { ConnectionMode, useVueFlow, VueFlow, type Connection, type NodeMouseEvent } from '@vue-flow/core';
import dagre from 'dagre';
import { Background } from '@vue-flow/background';
import { Controls, ControlButton } from '@vue-flow/controls';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/core/dist/style.css';
import { Tips } from '@/ui-frame/index.ts';

import BaseEdge from './baseEdge.vue';
import BaseNode from './baseNode.vue';
import { EDGE_HANDLE_ID, useFlowHistory } from './lib.ts';

interface ChartProps {
	showMode?: boolean;
	nodeConfigList: Record<
		ChartNodeType,
		{
			name: string;
			sourceNode: Array<ChartNodeType>;
			color: string;
			svg: string;
		}
	>;
}

interface CustomEdgeAttr {
	sourceHandle: (typeof EDGE_HANDLE_ID)['SOURCE_RIGHT'];
	targetHandle: (typeof EDGE_HANDLE_ID)['TARGET_LEFT'];
	type: 'default';
	source: string;
	target: string;
	animated?: boolean | undefined;
	data: ChartEdgeData;
	id: string;
}

const props = defineProps<ChartProps>();
const emit = defineEmits<{
	(event: 'to-add-node'): void;
	(
		event: 'to-edit',
		eleInfo: { type: 'node'; id: string; data?: ChartNodeData } | { type: 'edge'; id: string; data?: ChartEdgeData }
	): void;
	(event: 'click-node', node: { id: string; data: ChartNodeData }): void;
}>();
const contextMenu = reactive({
	show: false,
	x: 0,
	y: 0,
	target: { id: '', type: 'pane' as 'pane' | 'node' | 'edge' }
});
const addNodePostion = reactive<{ from: 'contextmenu' | 'view'; x: number; y: number }>({
	from: 'view',
	x: 0,
	y: 0
});
const connectingStartNode = ref<{ position: '' | 'source' | 'target'; id: string }>({
	position: '',
	id: ''
});
const {
	getEdges,
	getNodes,
	getSelectedNodes,
	getSelectedEdges,
	nodesDraggable,
	project,
	fitView,
	onPaneReady,
	removeSelectedNodes,
	removeSelectedEdges,
	addEdges,
	addNodes,
	updateEdge,
	updateNode,
	updateNodeData,
	updateEdgeData,
	findNode,
	findEdge,
	removeNodes,
	removeEdges
} = useVueFlow();
const { initHistory, goBack, goNext, addHistory, canBack, canNext } = useFlowHistory();
const closeContextMenu = () => {
	contextMenu.show = false;
};
const toAddNode = (from: 'contextmenu' | 'view') => {
	if (props.showMode) {
		return;
	}
	emit('to-add-node');

	addNodePostion.from = from;
	if (from === 'contextmenu') {
		addNodePostion.x =
			contextMenu.x - ((document.getElementsByClassName('view-aside')[0] as HTMLElement).offsetWidth || 0) - 30;
		addNodePostion.y =
			contextMenu.y - ((document.getElementsByClassName('app-header')[0] as HTMLElement).offsetHeight || 0) - 26;
	} else {
		addNodePostion.x = 80;
		addNodePostion.y = 20;
	}
	closeContextMenu();
};
const toEdit = (from: 'contextmenu' | 'view') => {
	let editType: 'node' | 'edge' = 'node';
	let eleId = '';

	if (from === 'view') {
		if (getSelectedEdges.value.length === 1) {
			editType = 'edge';
			eleId = getSelectedEdges.value[0]?.id || '';
		}
		if (getSelectedNodes.value.length === 1) {
			editType = 'node';
			eleId = getSelectedNodes.value[0]?.id || '';
		}
	}
	if (from === 'contextmenu') {
		editType = contextMenu.target.type === 'edge' ? 'edge' : 'node';
		eleId = contextMenu.target.id;
	}

	if (!eleId) {
		return;
	}
	emit('to-edit', {
		type: editType,
		id: eleId,
		data: editType === 'node' ? findNode(eleId)?.data : findEdge(eleId)?.data
	});
	closeContextMenu();
};
const deleteSelectedEles = async (from: 'contextmenu' | 'view') => {
	let eleIds: Array<{ type: 'node' | 'edge'; id: string }> = [];

	if (from === 'view') {
		eleIds = [
			...getSelectedEdges.value.map(e => ({ type: 'edge', id: e.id })),
			...getSelectedNodes.value.map(n => ({ type: 'node', id: n.id }))
		] as typeof eleIds;
	}
	if (from === 'contextmenu' && contextMenu.target.type !== 'pane') {
		eleIds = [{ type: contextMenu.target.type, id: contextMenu.target.id }];
	}

	if (eleIds.length === 0) {
		return;
	}
	const confirmed = await Tips.confirm(`确认删除选中的 ${eleIds.length} 个元素吗？`, '确认删除');

	if (!confirmed) {
		closeContextMenu();
		return;
	}
	removeNodes(eleIds.filter(d => d.type === 'node').map(d => d.id));
	removeEdges(eleIds.filter(d => d.type === 'edge').map(d => d.id));
	closeContextMenu();
};
const handleLayout = () => {
	if (getNodes.value.length === 0) return;

	const graph = new dagre.graphlib.Graph();

	graph.setDefaultEdgeLabel(() => ({}));
	graph.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 100, marginx: 40, marginy: 40 });

	getNodes.value.forEach(node => {
		const width = node.dimensions?.width || 180;
		const height = node.dimensions?.height || 70;

		graph.setNode(node.id, { width, height });
	});

	getEdges.value.forEach(edge => {
		graph.setEdge(edge.source, edge.target);
	});

	dagre.layout(graph);

	getNodes.value.forEach(node => {
		const position = graph.node(node.id) as { x: number; y: number };
		const width = node.dimensions?.width || 180;
		const height = node.dimensions?.height || 70;

		updateNode(node.id, {
			position: {
				x: position.x - width / 2,
				y: position.y - height / 2
			}
		});
	});

	// 3. 节点坐标重置后，在下一个帧对齐连线句柄并撑满视口
	nextTick(() => {
		getEdges.value.forEach(edge => {
			updateEdge(edge, {
				...edge,
				sourceHandle: EDGE_HANDLE_ID.SOURCE_RIGHT,
				targetHandle: EDGE_HANDLE_ID.TARGET_LEFT
			});
		});
		fitView({ padding: 0.2 });
		nextTick(() => {
			addHistory();
		});
	});
};
const _addNodes = (nodes: Array<{ id: string; data: ChartNodeData }>) => {
	if (props.showMode) {
		return;
	}
	const _nodes = nodes.map(s => ({
		...s,
		position: project({ x: addNodePostion.x, y: addNodePostion.y })
	}));

	addNodes(_nodes);
};

const addEdge = (edge: { source: string; target: string; animated?: boolean; data: ChartEdgeData }) => {
	if (props.showMode) {
		return;
	}
	const _edge: CustomEdgeAttr = {
		id: `edge_${edge.source}_to_${edge.target}_${Date.now()}`,
		...edge,
		sourceHandle: EDGE_HANDLE_ID.SOURCE_RIGHT,
		targetHandle: EDGE_HANDLE_ID.TARGET_LEFT,
		type: 'default'
	};

	addEdges([_edge]);
};

const _updateNodeData = (nodeId: string, data: Partial<ChartNodeData>) => {
	if (props.showMode) {
		return;
	}
	updateNodeData(nodeId, data);
};
const _updateEdgeData = (edgeId: string, data: Partial<ChartEdgeData>) => {
	if (props.showMode) {
		return;
	}
	updateEdgeData(edgeId, data);
};

defineExpose({
	addNodes: _addNodes,
	addEdge,
	updateNodeData: _updateNodeData,
	updateEdgeData: _updateEdgeData
});
const handleGlobalContextMenu = (e: MouseEvent) => {
	if (props.showMode) {
		return;
	}
	e.preventDefault();
	e.stopPropagation();

	contextMenu.x = e.clientX;
	contextMenu.y = e.clientY;

	const path = e.composedPath() as HTMLElement[];

	for (const el of path) {
		// 🌟 安全哨兵 1：如果打捞到了最外层包裹容器，或者越界到了 document/window，立刻安全终止
		if (el === e.currentTarget || (el.classList && el.classList.contains('flow-wrapper'))) {
			break;
		}

		// 🌟 安全哨兵 2：如果遇到没有 classList 的特殊底层碎片节点，跳过它，继续向上追溯其父级
		if (!el.classList) {
			continue;
		}

		if (el.classList.contains('vue-flow__node')) {
			const nodeId = el.getAttribute('data-id');

			if (nodeId) {
				contextMenu.target = { id: nodeId, type: 'node' };
				contextMenu.show = true;
				return;
			}
		}
		if (el.classList.contains('vue-flow__edge')) {
			const edgeId = el.getAttribute('data-id');

			if (edgeId) {
				contextMenu.target = { id: edgeId, type: 'edge' };
				contextMenu.show = true;
				return;
			}
		}
	}

	contextMenu.target = { id: '', type: 'pane' };
	contextMenu.show = true;
};
const handleClearAllSelected = () => {
	if (getSelectedNodes.value.length > 0) {
		removeSelectedNodes(getSelectedNodes.value);
	}
	if (getSelectedEdges.value.length > 0) {
		removeSelectedEdges(getSelectedEdges.value);
	}
};
const onNodeClick = (event: NodeMouseEvent) => {
	closeContextMenu();
	const isMultiSelectKeyPressed = event.event.shiftKey || event.event.ctrlKey || event.event.metaKey;

	if (!isMultiSelectKeyPressed && getSelectedNodes.value.length > 1) {
		const otherNodes = getSelectedNodes.value.filter(n => n.id !== event.node.id);

		removeSelectedNodes(otherNodes);
	}
	emit(
		'click-node',
		JSON.parse(
			JSON.stringify({
				id: event.node.id,
				data: event.node.data
			})
		)
	);
};
const checkWillFormCycle = (source: string, target: string): { validated: boolean; message: string } => {
	const visited = new Set<string>();

	// 内部 DFS 只负责死磕一个问题：能不能找到环？（返回纯 boolean）
	const hasCycle = (current: string): boolean => {
		if (current === source) return true; // 抓到现行，成环了！
		visited.add(current);

		const nextNodes = getEdges.value.filter(edge => edge.source === current).map(edge => edge.target);

		for (const next of nextNodes) {
			if (!visited.has(next)) {
				if (hasCycle(next)) return true;
			}
		}
		return false; // 安全安全，没有成环
	};

	// 由外层统一组装 Vue Flow 准入器需要的对象结构
	if (hasCycle(target)) {
		return { validated: false, message: '检测到循环依赖，无法创建，会引发闭环的链路' };
	}

	return { validated: true, message: '' };
};

const onConnectValidate = (connection: Connection): { validated: boolean; message?: string } => {
	if (connection.source === connection.target) return { validated: false, message: '节点不能连接自身' };

	const sourceNode = getNodes.value.find(n => n.id === connection.source);
	const targetNode = getNodes.value.find(n => n.id === connection.target);

	if (!sourceNode || !targetNode) return { validated: false, message: '节点不存在' };

	const sourceType = (sourceNode.data?.type || sourceNode.type) as ChartNodeType;
	const targetType = (targetNode.data?.type || targetNode.type) as ChartNodeType;

	// 1. 验证流水线准入层
	const allowedUpperTypes = props.nodeConfigList[targetType].sourceNode || [];

	if (allowedUpperTypes.length > 0 && !allowedUpperTypes.includes(sourceType)) {
		return { validated: false, message: '当前节点类型不符合流水线依赖准入规则' };
	}

	// 2. 验证依赖重复性
	const isAlreadyConnected = getEdges.value.some(
		edge => edge.source === connection.source && edge.target === connection.target
	);

	if (isAlreadyConnected) return { validated: false, message: '依赖关系已存在，无需重复连接' };

	return checkWillFormCycle(connection.source, connection.target);
};
const handleConnect = (connection: Connection) => {
	const { validated, message } = onConnectValidate(connection);

	if (!validated) {
		if (message) {
			Tips.error(message);
		}
		return;
	}

	const id = `edge_${connection.source}_to_${connection.target}_${Date.now()}`;

	addEdges({
		id,
		source: connection.source,
		target: connection.target,
		sourceHandle: EDGE_HANDLE_ID.SOURCE_RIGHT,
		targetHandle: EDGE_HANDLE_ID.TARGET_LEFT,
		type: 'default',
		data: { label: '' }
	});

	Tips.success('连线创建成功');
};

onPaneReady(() => {
	handleLayout();
});

provide('onEdgeLabelClick', undefined);
provide('onEdgeContextMenu', undefined);

onMounted(() => {
	window.addEventListener('click', closeContextMenu);
	initHistory();
});
onUnmounted(() => {
	window.removeEventListener('click', closeContextMenu);
});
</script>

<style lang="less" scoped>
.flow-wrapper {
	position: relative;
	height: 100%;
	background: #fff;
	border-radius: 8px;
	overflow: hidden;

	.flow-canvas {
		width: 100%;
		height: 100%;
	}

	.history-operate-btn {
		position: absolute;
		bottom: 12px;
		background: #fff;
		border: 1px solid #e5e6eb;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 0 12px;
		font-size: 13px;
		line-height: 26px;
		cursor: pointer;
		transition: box-shadow 0.3s ease;
	}

	.history-operate-btn:hover {
		color: #165dff;
		box-shadow: 0 0px 20px rgba(0, 0, 0, 0.35);
	}

	.custom-context-menu {
		position: fixed;
		z-index: 1000;
		background: #fff;
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 4px 0;

		.menu-item {
			padding: 8px 12px;
			font-size: 13px;
			color: #4e5969;
			cursor: pointer;
			display: flex;
			align-items: center;
			transition: background 0.2s;
		}

		.menu-item:hover {
			background-color: #f2f3f5;
			color: #165dff;
		}

		.menu-item.delete:hover {
			color: #f53f3f;
			background-color: #fff1f0;
		}
	}
}

:deep(.vue-flow__handle) {
	cursor: crosshair;
	z-index: 10;
	border-radius: 50%;
	width: 8px;
	height: 8px;
	box-sizing: border-box;
	border: 2px solid #fff;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
	opacity: 0;
	transition:
		transform 0.15s cubic-bezier(0.25, 1, 0.5, 1),
		background-color 0.15s,
		opacity 0.15s ease;
}

:deep(.vue-flow__handle:after) {
	content: '';
	position: absolute;
	width: 24px;
	height: 24px;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	background-color: transparent;
	pointer-events: all;
}

:deep(.vue-flow__node) {
	transition: transform 0.1s cubic-bezier(0.25, 1, 0.5, 1);
}

:deep(.vue-flow__node:hover) {
	.vue-flow__handle {
		opacity: 1;
		border-color: #ffffff;
		box-shadow: 0 0 8px rgba(22, 93, 255, 0.6);
	}

	.vue-flow__handle-top {
		transform: translate(-50%, -50%) translateY(1px) scale(1.25) !important;
	}

	.vue-flow__handle-bottom {
		transform: translate(-50%, 50%) translateY(-1px) scale(1.25) !important;
	}

	.vue-flow__handle-left {
		transform: translate(-50%, -50%) translateX(1px) scale(1.25) !important;
	}

	.vue-flow__handle-right {
		transform: translate(50%, -50%) translateX(-1px) scale(1.25) !important;
	}
}
</style>
