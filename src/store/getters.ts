import { RootState } from './stateModel';

export default {
    loginStatus: (state: RootState/*, getters*/): boolean => {
        return Boolean(state.user?.userId);
    }
};
