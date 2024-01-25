/* An Unstated container that keeps track of the global firebase state */


import { useAuthState } from "react-firebase-hooks/auth"
import { initFirebase } from "../firebase"
import { createContainer } from "unstated-next"


const { auth, firestore, storage } = initFirebase()

/* A hook that provides the auth and firebase state */
export const useFirebase = () => {
    let [user, loading, error] = useAuthState(auth)

    return {
        user, loading, error, auth, firestore, storage
    }
}

export const Firebase = createContainer(useFirebase)
