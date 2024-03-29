import { ElMessage, ElMessageBox, ElLoading, ElNotification, ElMessageBoxOptions, MessageBoxData, LoadingOptions, NotificationProps } from 'element-plus';
import { showToast, Dialog, showLoadingToast } from 'vant';

import i18n from '@/lang';
import store from '@/store';

import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-button.css';
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-notification.css';

interface CloseNotificationFn {
	(): void;
}

class UITool {
	private allNoticing: Set<CloseNotificationFn>;

	constructor() {
		this.allNoticing = new Set();
	}

	private t(message: string): string {
		return i18n.global.t(message);
	}

	private get isMobile(): boolean {
		return store.state.screenType === 'phone' || store.state.screenType === 'ipad';
	}

	public success(message: string): void {
		if (this.isMobile) {
			showToast({
				type: 'success',
				message: this.t(message),
				position: 'top'
			});
		} else {
			ElMessage({
				showClose: true,
				message: this.t(message),
				type: 'success'
			});
		}
	}

	public error(message: string): void {
		if (this.isMobile) {
			showToast({
				type: 'fail',
				message: this.t(message),
				position: 'top'
			});
		} else {
			ElMessage({
				showClose: true,
				message: this.t(message),
				type: 'error'
			});
		}
	}

	public warn(message: string): void {
		if (this.isMobile) {
			showToast({
				message: this.t(message),
				position: 'top'
			});
		} else {
			ElMessage({
				showClose: true,
				message: this.t(message),
				type: 'warning'
			});
		}
	}

	public async alert(message: string, title?: string, option?: ElMessageBoxOptions): Promise<true> {
		if (this.isMobile) {
			return await Dialog.alert({
				message: this.t(message),
				...title ? { title: this.t(title) } : {}
			}).then(() => true);
		}
		return await ElMessageBox.alert(this.t(message), this.t(title || ''), {
			...option,
			confirmButtonText: this.t(option?.confirmButtonText || 'yes'),
			type: option?.type || 'info',
			showClose: false,
			showCancelButton: false,
			closeOnClickModal: false,
			closeOnPressEscape: false,
			showInput: false
		}).then(() => true);
	}

	public async confirm(message: string, title?: string, option?: ElMessageBoxOptions): Promise<boolean> {
		if (this.isMobile) {
			return await Dialog.confirm({
				message: this.t(message),
				...title ? { title: this.t(title) } : {}
			}).then(() => true).catch(() => false);
		}
		return await ElMessageBox.alert(this.t(message), this.t(title || ''), {
			...option,
			confirmButtonText: this.t(option?.confirmButtonText || 'yes'),
			cancelButtonText: this.t(option?.cancelButtonText || 'cancel'),
			type: option?.type || 'info',
			showClose: false,
			showCancelButton: true,
			closeOnClickModal: false,
			closeOnPressEscape: false,
			showInput: false
		}).then(() => true).catch(() => false);
	}

	public async prompt(message: string, title: string, option?: ElMessageBoxOptions): Promise<string | false> {
		return await ElMessageBox.alert(this.t(message), this.t(title), {
			...option,
			confirmButtonText: this.t(option?.confirmButtonText || 'yes'),
			cancelButtonText: this.t(option?.cancelButtonText || 'cancel'),
			type: 'info',
			showClose: false,
			showCancelButton: true,
			closeOnClickModal: false,
			closeOnPressEscape: false,
			showInput: true,
			inputErrorMessage: this.t(option?.inputErrorMessage || 'it_is_illegal')
		}).then((data: MessageBoxData) => {
			if (data.action === 'cancel' || data.action === 'close' || data.action === 'confirm') {
				return false;
			} else {
				return data.value;
			}
		}).catch(() => false);
	}

	public loading(option?: LoadingOptions, text?: string) {
		if (this.isMobile) {
			return showLoadingToast({
				message: this.t(text || ''),
				forbidClick: true,
				duration: 0
			});
		}
		return ElLoading.service({
			...option,
			text: this.t(text || '')
		});
	}

	public noticing(title: string, message: string, option?: NotificationProps) {
		const noticing = ElNotification({
			...option,
			title: this.t(title),
			message: this.t(message)
		});

		this.allNoticing.add(noticing.close);
		return noticing;
	}

	public noticed(title: string, message: string, option?: NotificationProps) {
		const noticed = ElNotification({
			...option,
			title: this.t(title),
			message: this.t(message)
		});

		this.allNoticing.add(noticed.close);
		return noticed;
	}

	public closeAllNotice(): void {
		this.allNoticing.forEach(a => a());
	}
}

export default new UITool();
