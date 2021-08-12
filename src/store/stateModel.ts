export interface UserState {
    userId: string
    username: string;
}

export interface RootState {
    language: SupportLanguageType;
    menuHidden: boolean;
    screenType: 'phone' | 'ipad' | 'spc' | 'pc';
    user: UserState
}
