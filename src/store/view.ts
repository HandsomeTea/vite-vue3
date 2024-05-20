import { defineStore } from 'pinia';


export const useLanguageTypeStore = defineStore('languageType', {
	state: () => ({ language: window.navigator.language.toLowerCase() as SupportLanguageType }),
	actions: {
		setLanguage(language: SupportLanguageType) {
			this.language = language;
		}
	}
});

export const useMenuStatusStore = defineStore('menuHiddenStatus', {
	state: () => ({ menuHidden: false }),
	actions: {
		toogleSideShrink(isHidden?: boolean) {
			this.menuHidden = Boolean(isHidden);
		}
	}
});

export const useScreenStore = defineStore('screenSize', {
	state: () => ({ screenType: 'pc' } as { screenType: 'phone' | 'ipad' | 'spc' | 'pc' }),
	actions: {
		setScreenType() {
			const size = document.body.offsetWidth;

			if (size <= 767) {
				this.screenType = 'phone';
			} else if (size > 1200) {
				this.screenType = 'pc';
			} else if (size > 992) {
				this.screenType = 'spc';
			} else if (size > 768) {
				this.screenType = 'ipad';
			}
			if (this.screenType === 'phone' || this.screenType === 'ipad') {
				const store = useMenuStatusStore();

				store.toogleSideShrink(true);
			}
		}
	}
});
