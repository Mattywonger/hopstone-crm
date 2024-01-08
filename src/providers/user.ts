import { useAuthState } from "react-firebase-hooks/auth"
import { initFirebase } from "../firebase"
import { createContainer } from "unstated-next"

const { auth, firestore } = initFirebase()

export const useUser = () => {
    let [user, loading, error] = useAuthState(auth)

    return { user, loading, error, auth, firestore }
}

export const User = createContainer(useUser)