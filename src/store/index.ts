import { createStore } from 'vuex';
import { RootState, UserState } from './stateModel';
import user from './user';
import getters from './getters';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const state: RootState = {
    language: window.navigator.language.toLowerCase() as SupportLanguageType,
    menuHidden: false,
    screenType: 'pc'
};

const store = createStore({
    state,
    getters,
    modules: {
        user
    },
    mutations: {
        _toogleSideShrink(state: RootState, status?: boolean) {
            if (typeof status !== 'undefined') {
                state.menuHidden = status;
            } else {
                state.menuHidden = !state.menuHidden;
            }
        },
        _login(state: RootState, user: UserState) {
            state.user = user;
        },
        _logout(state: RootState) {
            // 是否登陆的判断就是看userId是否为空
            state.user.userId = '';
        },
        _setLanguage(state: RootState, language: SupportLanguageType) {
            if (state.language !== language) {
                state.language = language;
            }
        },
        _setScreenType(state: RootState, type: 'phone' | 'ipad' | 'spc' | 'pc') {
            if (state.screenType !== type) {
                state.screenType = type;

                if (state.screenType === 'phone' || state.screenType === 'ipad') {
                    state.menuHidden = true;
                }
            }
        }
    },
    actions: {
        toogleSideShrink({ commit }, status?: boolean) {
            commit('_toogleSideShrink', status);
        },
        login({ commit }) {
            commit('_login');
        },
        logout({ commit }) {
            commit('_logout');
        },
        setLanguage({ commit }, language: SupportLanguageType) {
            commit('_setLanguage', language);
        },
        setScreenType({ commit }) {
            const size = document.body.offsetWidth;

            if (size <= 767) {
                commit('_setScreenType', 'phone');
            } else if (size > 1200) {
                commit('_setScreenType', 'pc');
            } else if (size > 992) {
                commit('_setScreenType', 'spc');
            } else if (size > 768) {
                commit('_setScreenType', 'ipad');
            }
        }
    }
});

export default store;
