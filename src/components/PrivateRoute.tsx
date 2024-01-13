import React, { PropsWithChildren } from "react"
import { Firebase } from "../providers/user"
import { LoginPage } from "./LoginPage"

export const PrivateRoute = (props: PropsWithChildren) => {
    let { user } = Firebase.useContainer()

    return (
        user ?
            <React.Fragment> {props.children} </React.Fragment> :
            <LoginPage />
    )
}