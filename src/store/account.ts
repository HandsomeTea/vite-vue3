import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
	state: () => ({
		userId: '',
		username: 'coco'
	}),
	actions: {
		setUserName(username: string) {
			this.username = username;
		}
	},
	getters: {
		isLogin: state => Boolean(state.userId),
		getUserInfo: state => {
			return {
				userId: state.userId,
				username: state.username
			};
		}
	}
});
