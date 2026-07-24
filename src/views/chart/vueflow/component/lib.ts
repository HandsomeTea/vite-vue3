import { useVueFlow, type Edge } from '@vue-flow/core';
import { nextTick, ref } from 'vue';

/**
 * 将 Hex 转换为 HSL
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
	hex = hex.replace(/^#/, '');
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map(char => char + char)
			.join('');
	}
	const r = parseInt(hex.substring(0, 2), 16) / 255;
	const g = parseInt(hex.substring(2, 4), 16) / 255;
	const b = parseInt(hex.substring(4, 6), 16) / 255;

	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h = 0,
		s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;

		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			default:
				break;
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * 将 Hex 转换为 RGB 数组，方便给 rgba() 阴影使用
 */
function hexToRgb(hex: string): string {
	hex = hex.replace(/^#/, '');
	if (hex.length === 3)
		hex = hex
			.split('')
			.map(char => char + char)
			.join('');
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return `${r}, ${g}, ${b}`;
}

/**
 * 🎯 核心核心函数：输入一个主色 Hex，输出节点所需的整套视觉变量
 */
export function generateNodeTheme(mainColorHex: string) {
	const { h, s } = hexToHsl(mainColorHex);
	const rgbStr = hexToRgb(mainColorHex);

	return {
		// 1. 主色（用于边框、Icon、标题文字）
		primary: mainColorHex,

		// 2. 极浅背景色（固定 97% 亮度，保证通透且能看清字）
		bg: `hsl(${h}, ${s}%, 97%)`,

		// 3. 边框下方的分割线颜色（比背景稍微深一点点，90% 亮度）
		borderLight: `hsl(${h}, ${s}%, 90%)`,

		// 4. 传给 CSS 变量的纯 RGB 字符串，用于实现高性能 rgba 呼吸阴影
		shadowRgb: rgbStr
	};
}
export const EDGE_HANDLE_ID = {
	TARGET_LEFT: 't-l',
	SOURCE_RIGHT: 's-r'
} as const;
export interface ChartExpose<
	ExposeNodeType extends string,
	ExposeNodeData extends object & { label: string; type: ExposeNodeType },
	ExposeEdgeData extends object & { status?: 'running' | 'failed' | 'success'; label?: string }
> {
	addNodes: (nodes: Array<{ id: string; data: ExposeNodeData }>) => void;
	addEdge: (edge: { source: string; target: string; animated?: boolean; data: ExposeEdgeData }) => void;
	updateNodeData: (nodeId: string, data: Partial<ExposeNodeData>) => void;
	updateEdgeData: (edgeId: string, data: Partial<ExposeEdgeData>) => void;
}
interface FlowSnapshot {
	nodes: Node[];
	edges: Edge[];
}

const FLOW_HISTORY_KEY = 'vue-flow-history';
const BACK_KEY = `${FLOW_HISTORY_KEY}_back`;
const CURRENT_KEY = `${FLOW_HISTORY_KEY}_current`;
const NEXT_KEY = `${FLOW_HISTORY_KEY}_next`;
const MAX_STEPS = 20;

export function useFlowHistory() {
	const { nodes, edges, setNodes, setEdges, fitView } = useVueFlow();

	let isInternalAction = false;
	const canBack = ref(false);
	const canNext = ref(false);

	const updateCanState = () => {
		const backData = JSON.parse(localStorage.getItem(BACK_KEY) || '[]');
		const nextData = JSON.parse(localStorage.getItem(NEXT_KEY) || '[]');

		canBack.value = backData.length > 0;
		canNext.value = nextData.length > 0;
	};

	const captureSnapshot = (): FlowSnapshot => ({
		nodes: JSON.parse(JSON.stringify(nodes.value)),
		edges: JSON.parse(JSON.stringify(edges.value))
	});

	const initHistory = () => {
		const savedCurrent = localStorage.getItem(CURRENT_KEY);

		if (savedCurrent) {
			const snapshot = JSON.parse(savedCurrent) as FlowSnapshot;

			isInternalAction = true;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			setNodes(snapshot.nodes);
			setEdges(snapshot.edges);
			setTimeout(() => {
				isInternalAction = false;
			}, 50);
		} else {
			localStorage.setItem(CURRENT_KEY, JSON.stringify(captureSnapshot()));
		}
		updateCanState();
	};

	const addHistory = () => {
		if (isInternalAction) {
			return;
		}

		// 1. 获取变更前的 current 作为“过去”，压入 back
		const savedCurrent = localStorage.getItem(CURRENT_KEY);

		if (savedCurrent) {
			const currentBack = JSON.parse(localStorage.getItem(BACK_KEY) || '[]') as FlowSnapshot[];

			currentBack.push(JSON.parse(savedCurrent));
			if (currentBack.length > MAX_STEPS) {
				currentBack.shift();
			}
			localStorage.setItem(BACK_KEY, JSON.stringify(currentBack));
		}

		// 2. 将防抖完后的最新画布状态存为 current
		const newSnapshot = captureSnapshot();

		localStorage.setItem(CURRENT_KEY, JSON.stringify(newSnapshot));

		// 3. 产生新操作，清空 next
		localStorage.removeItem(NEXT_KEY);

		updateCanState();
	};

	const goBack = () => {
		const backData = JSON.parse(localStorage.getItem(BACK_KEY) || '[]') as FlowSnapshot[];

		if (backData.length === 0) {
			return;
		}

		isInternalAction = true;

		const savedCurrent = localStorage.getItem(CURRENT_KEY);

		if (savedCurrent) {
			const nextData = JSON.parse(localStorage.getItem(NEXT_KEY) || '[]') as FlowSnapshot[];

			nextData.push(JSON.parse(savedCurrent));
			localStorage.setItem(NEXT_KEY, JSON.stringify(nextData));
		}

		const targetState = backData.pop() as FlowSnapshot;

		localStorage.setItem(BACK_KEY, JSON.stringify(backData));

		localStorage.setItem(CURRENT_KEY, JSON.stringify(targetState));
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		setNodes(targetState.nodes);
		setEdges(targetState.edges);

		updateCanState();

		setTimeout(() => {
			isInternalAction = false;
		}, 50);
		nextTick(() => {
			fitView({ padding: 0.2 });
		});
	};

	const goNext = () => {
		const nextData = JSON.parse(localStorage.getItem(NEXT_KEY) || '[]') as FlowSnapshot[];

		if (nextData.length === 0) {
			return;
		}

		isInternalAction = true;

		const savedCurrent = localStorage.getItem(CURRENT_KEY);

		if (savedCurrent) {
			const currentBack = JSON.parse(localStorage.getItem(BACK_KEY) || '[]') as FlowSnapshot[];

			currentBack.push(JSON.parse(savedCurrent));
			localStorage.setItem(BACK_KEY, JSON.stringify(currentBack));
		}

		const targetState = nextData.pop() as FlowSnapshot;

		localStorage.setItem(NEXT_KEY, JSON.stringify(nextData));

		localStorage.setItem(CURRENT_KEY, JSON.stringify(targetState));
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		setNodes(targetState.nodes);
		setEdges(targetState.edges);

		updateCanState();

		setTimeout(() => {
			isInternalAction = false;
		}, 50);
		nextTick(() => {
			fitView({ padding: 0.2 });
		});
	};

	const clearHistory = () => {
		localStorage.removeItem(BACK_KEY);
		localStorage.removeItem(CURRENT_KEY);
		localStorage.removeItem(NEXT_KEY);
		updateCanState();
	};

	return {
		initHistory,
		addHistory,
		canBack,
		canNext,
		goBack,
		goNext,
		clearHistory
	};
}
