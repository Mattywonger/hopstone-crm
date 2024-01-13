import React, { PropsWithChildren } from "react"
import { Firebase } from "../providers/user"
import { LoadingPage } from "./LoadingPage"

/* This component waits until firebase is loaded to display its children */
export const FirebaseIsLoaded = (props: PropsWithChildren) => {
    const { loading, error } = Firebase.useContainer()

    return (
        loading ?
            <LoadingPage /> :
            error ?
                <p>{error.message}</p> :
                <React.Fragment> {props.children} </React.Fragment>
    )
}