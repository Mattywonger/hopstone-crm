import React, { PropsWithChildren } from "react"
import { User } from "../providers/user"
import { LoadingPage } from "./LoadingPage"

export const AuthIsLoaded = (props: PropsWithChildren) => {
    const { loading, error } = User.useContainer()

    return (
        loading ?
            <LoadingPage /> :
            error ?
                <p>{error.message}</p> :
                <React.Fragment> {props.children} </React.Fragment>
    )
}