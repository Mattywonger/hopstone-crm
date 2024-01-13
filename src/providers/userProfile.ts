import { doc } from "firebase/firestore";
import { Firebase } from "./user";
import { useDocument } from "react-firebase-hooks/firestore"
import { createContainer } from "unstated-next";

type UserProfile = {
    firstName: string,
    lastName: string
}

export const useUserProfile = () => {
    const { user, firestore } = Firebase.useContainer();

    const [snapshot, loading, error] = useDocument(doc(firestore, `users/${user?.uid}`))

    let profile: UserProfile | null | undefined

    if (snapshot) {
        const data = snapshot.data()
        profile = {
            firstName: data?.firstName,
            lastName: data?.lastName
        }
    }

    return { loading, error, profile }
}

export const Profile = createContainer(useUserProfile)