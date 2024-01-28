import React from "react"
import { Firebase } from "../providers/user"
import { LoginPage } from "./LoginPage"
import { Profile } from "../providers/userProfile"

export const PrivateRoute = (props: PrivateRouteProps) => {
    let { user } = Firebase.useContainer()

    return (
        user ? <Profile.Provider>{props.children}</Profile.Provider> : <LoginPage />
    )
}

export declare interface PrivateRouteProps {
    children: React.ReactNode,
}