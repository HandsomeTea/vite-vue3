import '@arco-design/web-vue/es/message/style/index.css';
import '@arco-design/web-vue/es/modal/style/index.css';
import '@arco-design/web-vue/es/notification/style/index.css';
import { Message, Modal, Notification } from '@arco-design/web-vue';
import i18n from '@/lang';

export default new (class UITips {
	private allNoticing = new Set<() => void>();

	private t(message: string): string {
		return i18n.global.t(message);
	}

	public success(message: string): void {
		Message.success({
			showIcon: true,
			content: this.t(message),
			position: 'top'
		});
	}

	public warn(message: string): void {
		Message.warning({
			showIcon: true,
			content: this.t(message),
			position: 'top'
		});
	}

	public error(message: string): void {
		Message.error({
			showIcon: true,
			content: this.t(message),
			position: 'top'
		});
	}

	public async confirm(message: string, title?: string, cancelText?: string): Promise<boolean> {
		return new Promise(resolve => {
			Modal.info({
				title: title ? this.t(title) : undefined,
				cancelText,
				content: this.t(message),
				titleAlign: 'start',
				hideCancel: false,
				escToClose: false,
				maskClosable: false,
				simple: false,
				closable: false,
				onOk: () => resolve(true),
				onCancel: () => resolve(false)
			});
		});
	}

	public noticing(title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') {
		const noticing = Notification[type]({
			title: this.t(title),
			content: this.t(message),
			closable: true,
			showIcon: true,
			duration: 8 * 1000
		});

		this.allNoticing.add(noticing.close);
		return noticing;
	}

	public noticed(title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') {
		const noticed = Notification[type]({
			title: this.t(title),
			content: this.t(message),
			closable: false,
			showIcon: true
		});

		this.allNoticing.add(noticed.close);
		return noticed;
	}

	public closeAllNotice(): void {
		this.allNoticing.forEach(a => a());
	}
})();
