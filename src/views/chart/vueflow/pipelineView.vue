<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Tips } from '@/ui-frame';
import { type EdgeData, type NodeData, type NodeType, NODE_CONFIGS } from './config.ts';
import type { ChartExpose } from './component/lib.ts';
import Chart from './component/chartView.vue';

const chartRef = ref<ChartExpose<NodeType, NodeData, EdgeData> | null>(null);

const NODE_TYPES: Array<{ value: NodeType; label: string }> = [
	{ value: 'origin', label: NODE_CONFIGS['origin'].name },
	{ value: 'compile', label: NODE_CONFIGS['compile'].name },
	{ value: 'evaluate', label: NODE_CONFIGS['evaluate'].name },
	{ value: 'convert', label: NODE_CONFIGS['convert'].name },
	{ value: 'train', label: NODE_CONFIGS['train'].name },
	{ value: 'result', label: NODE_CONFIGS['result'].name }
];

const showModal = ref(false);
const showEdgeModal = ref(false);
const isEdit = ref(false);
const isEdgeEdit = ref(false);
const currentNodeId = ref('');
const currentEdgeId = ref('');
const nodeForm = ref<{ label: string; type: NodeType }>({ label: '', type: 'origin' });
const edgeForm = ref({ label: '' });

const handleAddNode = () => {
	isEdit.value = false;
	nodeForm.value.label = '';
	nodeForm.value.type = 'origin';
	showModal.value = true;
};

const handleEdit = (
	eleInfo: { type: 'node'; id: string; data?: NodeData } | { type: 'edge'; id: string; data?: EdgeData }
) => {
	if (eleInfo.type === 'node') {
		const data = eleInfo.data;

		if (data) {
			isEdit.value = true;
			currentNodeId.value = eleInfo.id;
			nodeForm.value.label = data.label;
			nodeForm.value.type = data.type;
			showModal.value = true;
		}
	} else {
		const data = eleInfo.data;

		if (data) {
			isEdgeEdit.value = true;
			currentEdgeId.value = eleInfo.id;
			edgeForm.value.label = (data.label as string) ?? '';
			showEdgeModal.value = true;
		}
	}
};
const handleModalOk = () => {
	if (!chartRef.value) {
		return;
	}
	if (!nodeForm.value.label) {
		Tips.error('节点名称不能为空');
		return;
	}

	if (isEdit.value) {
		chartRef.value.updateNodeData(currentNodeId.value, {
			label: nodeForm.value.label,
			type: nodeForm.value.type
		});
	} else {
		const id = `node_${Date.now()}`;

		chartRef.value.addNodes([
			{
				id,
				data: { label: nodeForm.value.label, type: nodeForm.value.type }
			}
		]);

		Tips.success('添加成功');
	}
	showModal.value = false;
};

const handleEdgeModalOk = () => {
	if (!chartRef.value) {
		return;
	}
	if (isEdgeEdit.value) {
		chartRef.value.updateEdgeData(currentEdgeId.value, {
			label: edgeForm.value.label
		});
	}

	showEdgeModal.value = false;
};

onMounted(async () => {
	if (chartRef.value) {
		chartRef.value.addNodes([
			{ id: 'a', data: { label: '原始模型 A', type: 'origin' } },
			{ id: 'b', data: { label: '训练任务 B', type: 'train' } },
			{ id: 'c', data: { label: '远程编译 C', type: 'compile' } },
			{ id: 'd', data: { label: '模型转换 D', type: 'convert' } },
			{ id: 'e', data: { label: '模型评测 E', type: 'evaluate' } },
			{ id: 'f', data: { label: '结果展示 F', type: 'result' } }
		]);
		chartRef.value.addEdge({
			source: 'a',
			target: 'b',
			// animated: true,
			data: {
				// label: '触发训练'
				// status: 'running'
			}
		});
	}
});
</script>

<template>
	<div class="pipeline-container">
		<chart
			ref="chartRef"
			:node-config-list="NODE_CONFIGS"
			:show-mode="false"
			@to-add-node="handleAddNode"
			@to-edit="handleEdit"
			@click-node="nodeData => console.log('click-node', nodeData)"
		/>

		<a-modal v-model:visible="showModal" :title="isEdit ? '编辑节点' : '添加节点'" @ok="handleModalOk">
			<a-form :model="nodeForm">
				<a-form-item field="type" label="节点类型">
					<a-select v-model="nodeForm.type">
						<a-option v-for="item in NODE_TYPES" :key="item.value" :value="item.value">
							{{ item.label }}
						</a-option>
					</a-select>
				</a-form-item>
				<a-form-item field="label" label="节点名称">
					<a-input v-model="nodeForm.label" placeholder="请输入节点名称" />
				</a-form-item>
			</a-form>
		</a-modal>

		<a-modal v-model:visible="showEdgeModal" :title="isEdgeEdit ? '编辑连线' : '添加连线'" @ok="handleEdgeModalOk">
			<a-form :model="edgeForm">
				<a-form-item field="label" label="关系名称">
					<a-input v-model="edgeForm.label" placeholder="请输入关系名称 (如：调用、依赖)" />
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<style scoped lang="less">
.pipeline-container {
	box-sizing: border-box;
	background-color: #f5f5f5;
	border-radius: 8px;
	position: relative;
	border: 1px solid #e5e6eb;
	height: 540px;
}

.toolbar {
	padding: 15px;
	background: #fff;
	border-radius: 8px 8px 0 0;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid #e5e6eb;
	z-index: 100;
}
</style>
