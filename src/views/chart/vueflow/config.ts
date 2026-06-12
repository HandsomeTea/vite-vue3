export type NodeType = 'compile' | 'evaluate' | 'convert' | 'train' | 'origin' | 'result';
export interface NodeData {
	label: string;
	type: NodeType;
}
export interface EdgeData {
	status?: 'running' | 'failed' | 'success';
	label?: string;
}
/**
 * #4E5969 中性灰
 * #14C9C9 青色
 * #FF7D00 橙色
 * #722ED1 紫色
 * #165DFF Arco蓝
 * #00B42A 绿色
 */
export const NODE_CONFIGS: Record<NodeType, { name: string; color: string; sourceNode: Array<NodeType>; svg: string }> =
	{
		origin: {
			name: '原始模型',
			color: '#165DFF',
			sourceNode: [],
			svg: `<svg
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
			</svg>`
		},
		compile: {
			name: '远程编译',
			color: '#14C9C9',
			sourceNode: [],
			svg: `<svg
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M20 7h-9L9 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
			</svg>`
		},
		evaluate: {
			name: '模型评测',
			color: '#F7BA1E',
			sourceNode: ['convert', 'train'],
			svg: `<svg
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path
					d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
				/>
			</svg>`
		},
		convert: {
			name: '模型转换',
			color: '#722ED1',
			sourceNode: ['origin'],
			svg: `<svg
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
			</svg>`
		},
		train: {
			name: '模型训练',
			color: '#00B42A',
			sourceNode: ['convert', 'origin'],
			svg: `<svg
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M13 2L3 14h9v8l10-12h-9l10-10z" />
			</svg>`
		},
		result: {
			name: '结果展示',
			color: '#4E5969',
			sourceNode: ['evaluate', 'train'],
			svg: `<svg
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>`
		}
	};
