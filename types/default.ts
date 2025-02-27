

export interface Lang {
    fr: string
    en: string
}
export type Login = { jwt: string, user: any }
export type Method = "get" | "post" | "put" | "delete"
export type Language = 'en' | 'fr';
export type App = {
    isAuth: boolean,
    jwt: string,
    user: any,
    organisation: any,
    lang: Language
}