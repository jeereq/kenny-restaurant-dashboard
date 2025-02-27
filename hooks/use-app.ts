
import { App, Language, Login } from "@/types/default";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function useApp() {
    const router = useRouter();
    const [app, setApp] = useState<App>({ isAuth: false, jwt: "", user: null, organisation: null, lang: "fr" });
    const pathname = usePathname()


    function setAuth({ jwt, user }: Login, redirect: boolean = true): void {
        localStorage.setItem("token", jwt)

        localStorage.setItem("user", JSON.stringify(user))

        if (jwt != "" && user != null) {
            localStorage.setItem("isAuth", "true")
            setApp(function (state: any) {
                return { ...state, jwt, user, isAuth: true }
            })

            if (user?.userRole && redirect) {
                router.push(`/dashboard`);
            }
        } else {
            localStorage.setItem("isAuth", "false")
            setApp(function (state: any) {
                return { ...state, jwt: "", user: null, isAuth: false }
            })
            router.push('/auth/login')
        }
    }
    function setLanguage(lang: Language) {
        setApp(function (state: any) {
            return { ...state, lang }
        })
    }

    function getAuth() {
        const auth = localStorage.getItem("jwt") || app.jwt
        if (auth != "") {
            setAuth({
                jwt: auth,
                user: JSON.parse(localStorage.getItem("user") || app.user)
            }, false)
        }
    }
    function setUser(user: any) {
        localStorage.setItem("user", JSON.stringify(user))
        setApp(function (state: any) {
            return { ...state, user }
        })
    }
    function refreshApp() {
        const user = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") || '')
        const jwt = localStorage.getItem("jwt") && localStorage.getItem("jwt") || ''
        const isAuth = user ? true : false

        setUser(user)
        setApp(function (state: App) {
            return { ...state, jwt, isAuth }
        })
    }

    return { app, setLanguage, setAuth, setUser, getAuth, refreshApp }
}