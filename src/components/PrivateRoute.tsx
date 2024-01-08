import React, { PropsWithChildren } from "react"
import { User } from "../providers/user"
import { LoginPage } from "./LoginPage"

export const PrivateRoute = (props: PropsWithChildren) => {
    let { user } = User.useContainer()

    return (
        user ?
            <React.Fragment> {props.children} </React.Fragment> :
            <LoginPage />
    )
}